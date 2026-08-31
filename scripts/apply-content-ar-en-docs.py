#!/usr/bin/env python3
"""Apply the 30 Aug 2026 client DOCX copy to the local SIMF CMS database.

The migration is deliberately text-only. It preserves media relations, links,
layout/appearance settings, publish state, submissions, users, and uploads.
"""

from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATABASE = Path(os.environ.get("SIMF_DATABASE_PATH", ROOT / "simf.db"))
CONTENT_JSON = os.environ.get("SIMF_CONTENT_JSON")
SOURCE = Path(
    os.environ.get(
        "SIMF_CONTENT_DOCS",
        "/Users/muhammadinamullah/Downloads/content ar-en",
    )
)

LOCALES = tuple(
    locale.strip()
    for locale in os.environ.get("SIMF_CONTENT_LOCALES", "en,ar").split(",")
    if locale.strip()
)
if not LOCALES or any(locale not in {"en", "ar"} for locale in LOCALES):
    raise RuntimeError("SIMF_CONTENT_LOCALES must contain only 'en' and/or 'ar'")

ENABLE_ARABIC = os.environ.get("SIMF_ENABLE_ARABIC", "1").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}

if CONTENT_JSON:
    with Path(CONTENT_JSON).open(encoding="utf-8") as source_file:
        CONTENT = json.load(source_file)
else:
    CONTENT = None


def paragraphs(filename: str) -> list[str]:
    if CONTENT is not None:
        return CONTENT[filename]
    from docx import Document

    return [paragraph.text.strip() for paragraph in Document(SOURCE / filename).paragraphs]


HOME = paragraphs("الصفحة الرئيسية موقع الملتقى عربي.docx")
PROGRAMME = paragraphs("Programme (1).docx")
SPEAKERS = paragraphs("Speakers (1).docx")
LEGACY = paragraphs("Discover SIM 2026.docx")
NEWS = paragraphs("News & Media Center.docx")
CONTACT = paragraphs("Contact.docx")
SPONSOR = paragraphs("Become a Sponsor.docx")


def page_sections(database: sqlite3.Connection, page_type: str, locale: str) -> tuple[int, list[dict]]:
    row = database.execute(
        """
        select pl.id, pl.sections
        from pages_locales pl
        join pages p on p.id = pl._parent_id
        where p.page_type = ? and pl._locale = ?
        limit 1
        """,
        (page_type, locale),
    ).fetchone()
    if not row:
        raise RuntimeError(f"Missing localized page: {page_type} ({locale})")
    return int(row["id"]), json.loads(row["sections"] or "[]")


def section(sections: list[dict], anchor: str) -> dict:
    try:
        return next(item for item in sections if item.get("anchorID") == anchor)
    except StopIteration as error:
        raise RuntimeError(f"Missing required section: {anchor}") from error


def update_cards(target: dict, copy: list[tuple[str, str]], key: str = "cards") -> None:
    items = target.get(key, [])
    if len(items) < len(copy):
        raise RuntimeError(f"Expected at least {len(copy)} {key}; found {len(items)}")
    for item, (title, body) in zip(items, copy):
        item["title"] = title
        item["body"] = body


def update_buttons(target: dict, labels: list[str]) -> None:
    buttons = target.get("buttons", [])
    if len(buttons) < len(labels):
        raise RuntimeError(f"Expected at least {len(labels)} buttons; found {len(buttons)}")
    for button, label in zip(buttons, labels):
        button["label"] = label


def set_navigation(sections: list[dict], locale: str) -> None:
    if locale == "ar":
        by_href = {
            "/ar": HOME[3],
            "/ar/programme": HOME[4],
            "/ar/speakers": HOME[5],
            "/ar/partners": HOME[6],
            "/ar/b2g": HOME[7],
            "/ar/legacy": HOME[8],
            "/ar/updates": HOME[9],
            "/ar/contact": HOME[10],
            "/ar/sponsor": HOME[11],
        }
    else:
        by_href = {"/programme": "Agenda"}

    header = section(sections, "header")
    if locale == "ar":
        header["sponsorLabel"] = HOME[11]
    for link in header.get("links", []):
        if link.get("href") in by_href:
            link["label"] = by_href[link["href"]]

    footer = next((item for item in sections if item.get("anchorID") == "footer"), None)
    if footer:
        for link in footer.get("importantLinks", []):
            if link.get("href") in by_href:
                link["label"] = by_href[link["href"]]


def set_global_footer_copy(sections: list[dict], locale: str) -> None:
    footer = next((item for item in sections if item.get("anchorID") == "footer"), None)
    if not footer:
        return
    if locale == "ar":
        footer.update(
            bio=HOME[156],
            address="3507 الرياض 12341 المملكة العربية السعودية",
            phone="920010500",
            email="sim@startime.sa",
            contactHeading=HOME[163],
            linksHeading=HOME[168],
        )
    else:
        footer["bio"] = HOME[160]


def apply_home(sections: list[dict], locale: str) -> None:
    set_navigation(sections, locale)
    hero = section(sections, "top")
    authority = section(sections, "authority")
    authority["cards"] = authority.get("cards", [])[:2]

    if locale == "ar":
        hero.update(
            eyebrow="\n".join((HOME[16], HOME[17], HOME[18])),
            heading=HOME[19],
            body=HOME[20],
        )
        update_buttons(hero, ["كن راعياً", "اكتشف المزيد"])
        hero["eventDetails"][0].update(label="الزمان", value="23 - 25 نوفمبر 2026")
        hero["eventDetails"][1].update(label="المكان", value="فندق ومركز مؤتمرات سوفيتيل الرياض")
        countdown = section(sections, "countdown")
        labels = countdown.get("labels", {})
        labels.update(months="شهر", days="يوم", hours="ساعة", minutes="دقائق", seconds="ثواني")
        authority["heading"] = HOME[28]
        for card, title in zip(authority["cards"], ["وزارة الدفاع", "القوات البحرية الملكية السعودية"]):
            card["title"] = title

        about = section(sections, "about")
        about.update(
            eyebrow=HOME[31],
            heading=HOME[32],
            body=f"{HOME[33]}\n\n{HOME[34]}",
            ctaLabel=HOME[35],
        )
        legacy = section(sections, "legacy")
        legacy["heading"] = HOME[47]
        for metric, value, label in zip(
            legacy.get("metrics", []),
            ["+40", "100+", "220+", "500+"],
            ["دولة مشاركة", "قائد وصانع قرار", "متحدث دولي", "شريك وراعِ"],
        ):
            metric.update(value=value, label=label)

        indicators = section(sections, "indicators")
        indicators.update(eyebrow=HOME[55], heading=HOME[56])
        indicator_copy = [
            ("1.4 مليون كيلومتر", "كابلات الاتصالات البحرية"),
            ("19 تريليون دولار سنويًا", "بيانات مالية تعبر البحار"),
            ("80%", "من السلع تنقل بحرًا"),
            ("100 مليون", "حاوية تمر عبر الموانئ سنويًا"),
            ("+350%", "معدل ارتفاع في تكاليف الشحن"),
            ("30-50%", "معدل تأخر الرحلات البحرية"),
            ("+50%", "من تجارة النفط تنقل بحرا"),
            ("+30%", "من الغاز الطبيعي يُنقل بحرًا"),
            ("900 ألف كيلومتر", "شبكات الأنابيب البحرية حول العالم"),
            ("+400", "كابل بحري نشط يربط القارات"),
            ("+200%", "معدل نمو التهديدات السيبرانية البحرية"),
            ("+300%", "ارتفاع في الهجمات على البنية التحتية البحري"),
        ]
        for metric, (value, label) in zip(indicators.get("metrics", []), indicator_copy):
            metric.update(value=value, label=label)

        audience = section(sections, "audience")
        audience.update(eyebrow=HOME[71], heading=HOME[72])
        update_cards(audience, [(HOME[i], HOME[i + 1]) for i in [73, 75, 77, 79, 81]])

        speakers = section(sections, "speakers")
        speakers.update(eyebrow=HOME[102], heading=HOME[103])
        update_buttons(speakers, [HOME[116]])
        for card, title, body in zip(
            speakers.get("cards", []),
            [HOME[106], HOME[110], HOME[114]],
            [HOME[107], HOME[111], HOME[115]],
        ):
            card.update(title=title, body=body)

        partners = section(sections, "partners")
        partners.update(eyebrow=HOME[125], heading=HOME[126])

        sponsorship = section(sections, "sponsorship")
        sponsorship.update(eyebrow=HOME[132], heading=HOME[133], body=HOME[135])
        update_buttons(sponsorship, ["لطلب الرعاية", "استكشف فرص الرعاية"])

        footer = section(sections, "footer")
        footer.update(
            bio=HOME[156],
            address="3507 الرياض 12341 المملكة العربية السعودية",
            phone="920010500",
            email="sim@startime.sa",
            contactHeading=HOME[163],
            linksHeading=HOME[168],
        )
    else:
        about = section(sections, "about")
        about.update(
            eyebrow=HOME[38],
            heading=HOME[39],
            body=f"{HOME[40]}\n\n{HOME[41]}",
        )
        audience = section(sections, "audience")
        audience.update(eyebrow=HOME[85], heading=HOME[86])
        update_cards(audience, [(HOME[i], HOME[i + 1]) for i in [87, 89, 91, 93, 95]])
        section(sections, "speakers")["eyebrow"] = "GUESTS & PARTICIPANTS"
        sponsorship = section(sections, "sponsorship")
        sponsorship.update(eyebrow=HOME[140], heading=HOME[141], body=HOME[143])
        section(sections, "footer")["bio"] = HOME[160]


def apply_programme(sections: list[dict], locale: str) -> None:
    set_navigation(sections, locale)
    hero = section(sections, "page-hero")
    intro = section(sections, "page-introduction")
    days = section(sections, "programme-days")
    highlights = section(sections, "programme-highlights")
    topics = section(sections, "key-topics")
    agenda = section(sections, "agenda")

    if locale == "ar":
        hero.update(heading=PROGRAMME[12], body=PROGRAMME[13])
        update_buttons(hero, ["اكتشف فرص الرعاية", "تواصل معنا"])
        intro.update(heading=PROGRAMME[33], body=f"{PROGRAMME[34]}\n\n{PROGRAMME[35]}")
        days["heading"] = PROGRAMME[48]
        update_cards(days, [(PROGRAMME[i], PROGRAMME[i + 1]) for i in [50, 52, 54]])
        highlights.update(eyebrow=PROGRAMME[70], heading=PROGRAMME[71], body=PROGRAMME[72])
        update_cards(highlights, [(PROGRAMME[i], PROGRAMME[i + 1]) for i in [74, 76, 78, 80, 82]])
        topics.update(eyebrow=PROGRAMME[106], heading=PROGRAMME[107], body=PROGRAMME[108])
        update_cards(topics, [(PROGRAMME[i], PROGRAMME[i + 1]) for i in [111, 115, 119, 122, 125]], "steps")
        agenda.update(heading=PROGRAMME[165], body=PROGRAMME[167])
        update_buttons(agenda, ["اكتشف فرص الرعاية", "تواصل معنا"])
    else:
        hero.update(heading=PROGRAMME[19], body=PROGRAMME[20])
        intro.update(heading=PROGRAMME[39], body=PROGRAMME[40])
        days["heading"] = PROGRAMME[58]
        update_cards(days, [(PROGRAMME[i], PROGRAMME[i + 1]) for i in [59, 61, 63]])
        highlights.update(eyebrow=PROGRAMME[86], heading=PROGRAMME[87], body=PROGRAMME[88])
        update_cards(highlights, [(PROGRAMME[i], PROGRAMME[i + 1]) for i in [90, 92, 94, 96, 98]])
        topics.update(eyebrow=PROGRAMME[131], heading=PROGRAMME[132], body=PROGRAMME[133])
        update_cards(topics, [(PROGRAMME[i], PROGRAMME[i + 1]) for i in [135, 138, 141, 144, 147]], "steps")


def apply_speakers(sections: list[dict], locale: str) -> None:
    set_navigation(sections, locale)
    hero = section(sections, "page-hero")
    intro = section(sections, "page-introduction")
    categories = section(sections, "speaker-categories")
    conversion = section(sections, "conversion")
    if locale == "ar":
        hero.update(heading=SPEAKERS[7], body=SPEAKERS[8])
        update_buttons(hero, [SPEAKERS[9]])
        intro.update(heading=SPEAKERS[22], body=f"{SPEAKERS[23]}\n\n{SPEAKERS[24]}")
        categories.update(heading=SPEAKERS[38], body=SPEAKERS[40])
        update_cards(categories, [(SPEAKERS[i], SPEAKERS[i + 1]) for i in [41, 43, 45, 47, 49, 51, 53]])
        conversion.update(eyebrow=SPEAKERS[81], heading=SPEAKERS[82], body=SPEAKERS[83])
        update_buttons(conversion, [SPEAKERS[84]])
    else:
        hero.update(heading=SPEAKERS[12], body=SPEAKERS[13])
        update_buttons(hero, [SPEAKERS[14]])
        intro.update(heading=SPEAKERS[27], body=f"{SPEAKERS[28]}\n\n{SPEAKERS[29]}")
        categories.update(heading=SPEAKERS[56], body=SPEAKERS[57])
        update_cards(categories, [(SPEAKERS[i], SPEAKERS[i + 1]) for i in [58, 60, 62, 64, 66, 68, 70]])
        conversion.update(eyebrow=SPEAKERS[87], heading=SPEAKERS[88], body=SPEAKERS[89])
        update_buttons(conversion, [SPEAKERS[90]])


def apply_legacy(sections: list[dict], locale: str) -> None:
    set_navigation(sections, locale)
    hero = section(sections, "page-hero")
    intro = section(sections, "page-introduction")
    editions = section(sections, "previous-editions")
    evolution = section(sections, "strategic-evolution")
    continuation = section(sections, "legacy-continues")
    if locale == "ar":
        hero.update(eyebrow=LEGACY[8], heading=LEGACY[9], body=f"{LEGACY[10]}\n\n{LEGACY[11]}")
        intro.update(heading=LEGACY[23], body=f"{LEGACY[24]}\n\n{LEGACY[25]}\n\n{LEGACY[26]}")
        editions["heading"] = "نسخ صنعت إرث الملتقى"
        update_cards(editions, [
            (LEGACY[34], LEGACY[36]),
            (LEGACY[45], LEGACY[47]),
            (LEGACY[56], LEGACY[58]),
        ], "steps")
        for step, label in zip(editions["steps"], [LEGACY[35], LEGACY[46], LEGACY[57]]):
            step["label"] = label
        evolution.update(eyebrow=LEGACY[66], heading=LEGACY[67])
        update_cards(evolution, [(LEGACY[i], LEGACY[i + 1]) for i in [69, 72, 75, 78]], "steps")
        continuation.update(
            eyebrow=LEGACY[99],
            heading=LEGACY[100],
            body=f"{LEGACY[101]}\n\n{LEGACY[103]}\n\n{LEGACY[104]}\n\n{LEGACY[105]}\n{LEGACY[106]}",
        )
    else:
        hero.update(eyebrow=LEGACY[14], heading=LEGACY[15], body=f"{LEGACY[16]}\n\n{LEGACY[17]}")
        intro.update(heading=LEGACY[29], body=f"{LEGACY[30]}\n\n{LEGACY[31]}")
        editions["heading"] = "Editions That Shaped the Forum's Legacy"
        update_cards(editions, [
            (LEGACY[39], LEGACY[41]),
            (LEGACY[49], LEGACY[51]),
            (LEGACY[62], LEGACY[64]),
        ], "steps")
        for step, label in zip(editions["steps"], [LEGACY[40], LEGACY[50], LEGACY[63]]):
            step["label"] = label
        evolution.update(eyebrow=LEGACY[82], heading=LEGACY[83])
        update_cards(evolution, [(LEGACY[i], LEGACY[i + 1]) for i in [86, 89, 92, 95]], "steps")
        continuation.update(
            eyebrow=LEGACY[107],
            heading=LEGACY[108],
            body=f"{LEGACY[109]}\n\n{LEGACY[110]}\n\n{LEGACY[111]}\n\n{LEGACY[112]}\n{LEGACY[113]}",
        )


def apply_news(sections: list[dict], locale: str) -> None:
    set_navigation(sections, locale)
    hero = section(sections, "updates-top")
    cta = section(sections, "updates-cta")
    if locale == "ar":
        hero.update(eyebrow=NEWS[8], heading=NEWS[9], body=NEWS[10])
        cta.update(eyebrow=NEWS[31], heading=NEWS[32], body=NEWS[34])
        update_buttons(cta, [NEWS[36]])
    else:
        hero.update(eyebrow=NEWS[12], heading=NEWS[13], body=NEWS[14])


def apply_contact(sections: list[dict], locale: str) -> None:
    set_navigation(sections, locale)
    if locale != "ar":
        return
    hero = section(sections, "page-hero")
    hero.update(heading=CONTACT[6], body=CONTACT[7])
    details = section(sections, "contact-details")
    details.update(heading=CONTACT[11], body=CONTACT[12])
    update_cards(details, [
        ("البريد الإلكتروني", "sim@startime.sa"),
        ("الهاتف", "920010500"),
        ("العنوان", "3507الرياض 12341، المملكة العربية السعودية"),
    ])
    form = section(sections, "contact-form")
    form.update(heading=CONTACT[20], body=CONTACT[21], privacyNote=CONTACT[30].removeprefix("□").strip())


def apply_sponsor(sections: list[dict], locale: str) -> None:
    set_navigation(sections, locale)
    hero = section(sections, "page-hero")
    community = section(sections, "sponsor-community")
    slider = section(sections, "sponsor-slider")
    reasons = section(sections, "sponsor-reasons")
    opportunities = section(sections, "sponsorship-opportunities")
    value = section(sections, "sponsorship-value")
    process = section(sections, "sponsorship-process")
    form = section(sections, "sponsor-form")
    conversion = section(sections, "conversion")
    if locale == "ar":
        hero.update(heading=f"{SPONSOR[10]}\n{SPONSOR[11]}", body=SPONSOR[12])
        update_buttons(hero, [SPONSOR[13]])
        community.update(heading=SPONSOR[28], body=SPONSOR[29])
        slider.update(eyebrow=SPONSOR[38], heading=SPONSOR[39])
        reasons.update(eyebrow=SPONSOR[50], heading=SPONSOR[51], body=SPONSOR[53])
        update_cards(reasons, [(SPONSOR[i], SPONSOR[i + 1]) for i in [65, 67, 69, 71]])
        opportunities.update(eyebrow=SPONSOR[88], heading=SPONSOR[89], body=SPONSOR[90])
        update_cards(opportunities, [(SPONSOR[i], SPONSOR[i + 1]) for i in [95, 97, 99, 101, 103, 105, 107]])
        update_buttons(opportunities, [SPONSOR[109]])
        value.update(eyebrow=SPONSOR[135], heading=SPONSOR[136], body=SPONSOR[137])
        update_cards(value, [(SPONSOR[i], SPONSOR[i + 1]) for i in [138, 140, 142]])
        process.update(eyebrow=SPONSOR[158], heading=SPONSOR[159], body=SPONSOR[170])
        update_cards(process, [(SPONSOR[i], SPONSOR[i + 1]) for i in [160, 162, 164, 166, 168]], "steps")
        form.update(
            eyebrow=SPONSOR[195],
            heading=SPONSOR[196],
            body=SPONSOR[197],
            privacyNote=SPONSOR[208].removeprefix("□").strip(),
        )
        conversion.update(
            eyebrow=SPONSOR[225],
            heading=SPONSOR[226],
            body=f"{SPONSOR[227]}\n\n{SPONSOR[228]}",
        )
        update_buttons(conversion, [SPONSOR[229], SPONSOR[230]])
    else:
        hero.update(heading=f"{SPONSOR[18]}\n{SPONSOR[19]}", body=f"{SPONSOR[20]}\n\n{SPONSOR[21]}")
        community.update(heading=SPONSOR[33], body=SPONSOR[34])
        slider.update(eyebrow=SPONSOR[43], heading=SPONSOR[44])
        reasons.update(eyebrow=SPONSOR[57], heading=SPONSOR[58], body=SPONSOR[60])
        update_cards(reasons, [(SPONSOR[i], SPONSOR[i + 1]) for i in [76, 78, 80, 82]])
        opportunities.update(eyebrow=SPONSOR[111], heading=SPONSOR[112], body=SPONSOR[113])
        update_cards(opportunities, [(SPONSOR[i], SPONSOR[i + 1]) for i in [115, 117, 119, 121, 123, 125, 127]])
        update_buttons(opportunities, [SPONSOR[129]])
        value.update(eyebrow=SPONSOR[145], heading=SPONSOR[146], body=SPONSOR[147])
        update_cards(value, [(SPONSOR[i], SPONSOR[i + 1]) for i in [148, 150, 152]])
        process.update(eyebrow=SPONSOR[174], heading=SPONSOR[175], body=SPONSOR[186])
        update_cards(process, [(SPONSOR[i], SPONSOR[i + 1]) for i in [176, 178, 180, 182, 184]], "steps")
        form.update(
            eyebrow=SPONSOR[212],
            heading=SPONSOR[213],
            body=SPONSOR[214],
            privacyNote=SPONSOR[220].removeprefix("□").strip(),
        )
        conversion.update(
            eyebrow=SPONSOR[233],
            heading=SPONSOR[234],
            body=SPONSOR[235],
        )
        update_buttons(conversion, [SPONSOR[236], SPONSOR[237]])


APPLIERS = {
    "simf-microsite-home": apply_home,
    "simf-microsite-programme": apply_programme,
    "simf-microsite-speakers": apply_speakers,
    "simf-microsite-legacy": apply_legacy,
    "simf-microsite-updates": apply_news,
    "simf-microsite-contact": apply_contact,
    "simf-microsite-sponsor": apply_sponsor,
}


def update_form_copy(database: sqlite3.Connection) -> None:
    contact_labels = [CONTACT[i] for i in range(23, 31)]
    sponsor_ar = [SPONSOR[i] for i in range(198, 206)] + [SPONSOR[207].removeprefix("□").strip()]
    sponsor_en_by_name = {
        "primaryObjective": SPONSOR[218].removesuffix("*").strip(),
        "consent": SPONSOR[219].removeprefix("□").strip(),
    }

    if "ar" in LOCALES:
        forms = {
            "simf-contact": (contact_labels, CONTACT[31]),
            "simf-microsite-sponsorship": (sponsor_ar, SPONSOR[210]),
        }
        for form_key, (labels, submit_label) in forms.items():
            row = database.execute("select id from forms where form_key = ? limit 1", (form_key,)).fetchone()
            if not row:
                raise RuntimeError(f"Missing required form: {form_key}")
            form_id = int(row["id"])
            for order, label in enumerate(labels, 1):
                database.execute(
                    "update forms_fields set label = ? where _parent_id = ? and _locale = 'ar' and _order = ?",
                    (label, form_id, order),
                )
            database.execute(
                "update forms_locales set submit_label = ? where _parent_id = ? and _locale = 'ar'",
                (submit_label, form_id),
            )

    if "en" in LOCALES:
        sponsor_form_id = int(
            database.execute("select id from forms where form_key = 'simf-microsite-sponsorship'").fetchone()["id"]
        )
        for name, label in sponsor_en_by_name.items():
            database.execute(
                "update forms_fields set label = ? where _parent_id = ? and _locale = 'en' and name = ?",
                (label, sponsor_form_id, name),
            )
        database.execute(
            "update forms_locales set submit_label = ? where _parent_id = ? and _locale = 'en'",
            (SPONSOR[221], sponsor_form_id),
        )


def main() -> None:
    if not DATABASE.exists():
        raise SystemExit(f"Database not found: {DATABASE}")

    stamp = datetime.now().strftime("%Y%m%dT%H%M%S")
    backup_root = Path(
        os.environ.get("SIMF_BACKUP_ROOT", ROOT / ".runtime" / "local-backups")
    )
    backup_dir = backup_root / f"pre-content-docs-{stamp}"
    backup_dir.mkdir(parents=True, exist_ok=False)
    backup_database = backup_dir / DATABASE.name
    with sqlite3.connect(DATABASE) as source_database, sqlite3.connect(backup_database) as target_database:
        source_database.backup(target_database)
        backup_integrity = target_database.execute("pragma integrity_check").fetchone()[0]
        if backup_integrity != "ok":
            raise RuntimeError(f"SQLite backup integrity check failed: {backup_integrity}")

    with sqlite3.connect(DATABASE) as database:
        database.row_factory = sqlite3.Row
        database.execute("pragma foreign_keys = on")
        updated: list[str] = []
        for page_type, apply in APPLIERS.items():
            for locale in LOCALES:
                row_id, sections = page_sections(database, page_type, locale)
                apply(sections, locale)
                database.execute(
                    "update pages_locales set sections = ? where id = ?",
                    (json.dumps(sections, ensure_ascii=False, separators=(",", ":")), row_id),
                )
                updated.append(f"{page_type}:{locale}")

        # Navigation and the footer are shared site-wide in the design but stored
        # inside every page document. Keep their supplied copy consistent on all
        # routes, including Partners and B2G which have no body-copy revision here.
        all_pages = database.execute(
            """
            select pl.id, pl._locale, pl.sections
            from pages_locales pl
            join pages p on p.id = pl._parent_id
            where p.page_type like 'simf-microsite-%'
            """
        ).fetchall()
        for row in all_pages:
            if row["_locale"] not in LOCALES:
                continue
            sections = json.loads(row["sections"] or "[]")
            if any(item.get("anchorID") == "header" for item in sections):
                set_navigation(sections, row["_locale"])
            set_global_footer_copy(sections, row["_locale"])
            database.execute(
                "update pages_locales set sections = ? where id = ?",
                (json.dumps(sections, ensure_ascii=False, separators=(",", ":")), row["id"]),
            )

        # The supplied programme document explicitly renames the English page label.
        if "en" in LOCALES:
            database.execute(
                """
                update pages_locales
                set title = 'Agenda', seo_title = 'Agenda | Saudi International Maritime Forum 2026'
                where _locale = 'en' and _parent_id = (
                  select id from pages where page_type = 'simf-microsite-programme' limit 1
                )
                """
            )
        update_form_copy(database)
        database.execute(
            "update site_settings set enable_arabic = ? where id = 1",
            (1 if ENABLE_ARABIC else 0,),
        )
        integrity = database.execute("pragma integrity_check").fetchone()[0]
        if integrity != "ok":
            raise RuntimeError(f"SQLite integrity check failed: {integrity}")
        database.commit()

    print(json.dumps({
        "updated": updated,
        "locales": list(LOCALES),
        "arabicEnabled": ENABLE_ARABIC,
        "backup": str(backup_dir),
        "integrity": "ok",
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
