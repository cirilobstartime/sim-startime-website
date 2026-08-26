#!/usr/bin/env python3
"""Apply the approved Arabic client copy to the local SQLite database only.

This intentionally updates Arabic localized text while preserving English content,
media relations, CMS-added logos, links, layout configuration, and publish state.
"""

from __future__ import annotations

import json
import os
import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATABASE = Path(os.environ.get("SIMF_DATABASE_PATH", ROOT / "simf.db"))
DOCX = Path(sys.argv[1])


def extract_paragraphs(path: Path) -> dict[int, dict[str, object]]:
    if path.suffix.lower() == ".json":
        source = json.loads(path.read_text(encoding="utf-8"))
        return {int(number): value for number, value in source.items()}

    from docx import Document

    result: dict[int, dict[str, object]] = {}
    ordinal = 0
    for paragraph in Document(path).paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue
        ordinal += 1
        result[ordinal] = {
            "text": text,
            "runs": [
                {"text": run.text, "bold": bool(run.bold)}
                for run in paragraph.runs
                if run.text
            ],
        }
    return result


P = extract_paragraphs(DOCX)


def text(number: int) -> str:
    return str(P[number]["text"]).strip()


def buttons(number: int) -> list[str]:
    return re.findall(r"\[([^]]+)]", text(number))


def title_body(number: int) -> tuple[str, str]:
    runs = list(P[number]["runs"])
    title_parts: list[str] = []
    body_parts: list[str] = []
    in_body = False
    for run in runs:
        if not run["bold"]:
            in_body = True
        (body_parts if in_body else title_parts).append(str(run["text"]))
    title = "".join(title_parts).strip()
    body = "".join(body_parts).strip()
    title = re.sub(r"^\d{2}\s*[—-]\s*", "", title).strip()
    body = re.sub(r"^[—\-–]\s*", "", body).strip()
    return title, body


def section(sections: list[dict], anchor: str) -> dict:
    return next(item for item in sections if item.get("anchorID") == anchor)


def set_buttons(target: dict, number: int) -> None:
    labels = buttons(number)
    for index, label in enumerate(labels):
        if index < len(target.get("buttons", [])):
            target["buttons"][index]["label"] = label


def set_cards(target: dict, ordinals: list[int], key: str = "cards") -> None:
    for item, number in zip(target.get(key, []), ordinals):
        title, body = title_body(number)
        item["title"] = title
        if body:
            item["body"] = body


def set_navigation(sections: list[dict]) -> None:
    labels = [
        "الرئيسية",
        "البرنامج",
        "المتحدثون",
        "الرعاة والشركاء",
        "فرص B2G",
        "نسخ سابقة",
        "المركز الإعلامي والأخبار",
        "تواصل معنا",
    ]
    header = section(sections, "header")
    for link, label in zip(header.get("links", []), labels):
        link["label"] = label
    footer = next((item for item in sections if item.get("anchorID") == "footer"), None)
    if footer:
        footer_labels = [
            "الرئيسية",
            "البرنامج",
            "المتحدثون",
            "الرعاة والشركاء",
            "فرص B2G",
            "كن راعيًا",
            "نسخ سابقة",
            "المركز الإعلامي والأخبار",
            "تواصل معنا",
        ]
        for link, label in zip(footer.get("importantLinks", []), footer_labels):
            link["label"] = label


def apply_home(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "top")
    hero.update(eyebrow=text(3), heading=text(4), body=text(5))
    set_buttons(hero, 6)
    hero["eventDetails"][0].update(label="التاريخ", value="23–25 نوفمبر 2026")
    hero["eventDetails"][1].update(
        label="المكان",
        value="فندق ومركز مؤتمرات سوفيتيل الرياض، المملكة العربية السعودية",
    )

    about = section(sections, "about")
    about.update(eyebrow=text(8), heading=text(9), body=text(10), ctaLabel=buttons(11)[0])
    section(sections, "legacy")["heading"] = text(12)

    indicators = section(sections, "indicators")
    indicators.update(eyebrow=text(14), heading=text(15))

    audience = section(sections, "audience")
    audience.update(heading=text(16))
    set_cards(audience, list(range(17, 22)))

    speakers = section(sections, "speakers")
    speakers.update(eyebrow=text(22), heading=text(23))
    home_speaker_markers = [
        (" رئيس هيئة الأركان العامة", "رئيس هيئة الأركان العامة", "القوات المسلحة السعودية"),
        (" نائب رئيس هيئة الأركان العامة", "نائب رئيس هيئة الأركان العامة", "القوات المسلحة السعودية"),
        (" رئيس الأركان", "رئيس الأركان", "القوات البحرية الملكية السعودية"),
    ]
    for card, number, (marker, role, workplace) in zip(
        speakers.get("cards", []), [24, 25, 26], home_speaker_markers
    ):
        source = text(number).removeprefix("قيادة عليا ")
        name = source.split(marker, 1)[0]
        card.update(eyebrow="قيادة عليا", title=name, body=role, workplace=workplace)
    set_buttons(speakers, 27)

    partners = section(sections, "partners")
    partners.update(eyebrow=text(28), heading=text(29))

    sponsorship = section(sections, "sponsorship")
    sponsorship.update(eyebrow=text(30), heading=text(31), body=text(32))
    set_buttons(sponsorship, 33)


def apply_programme(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "page-hero")
    hero.update(heading=text(35), body=text(36))
    set_buttons(hero, 37)
    intro = section(sections, "page-introduction")
    intro.update(eyebrow=text(38), heading=text(39), body=text(40))
    set_cards(section(sections, "programme-days"), [41, 42, 43])
    highlights = section(sections, "programme-highlights")
    highlights.update(eyebrow=text(44), heading=text(45), body=text(46))
    set_cards(highlights, [47, 48, 49, 50, 51])
    topics = section(sections, "key-topics")
    topics.update(eyebrow=text(52), heading=text(53), body=text(54))
    set_cards(topics, [55, 56, 57, 58, 59], "steps")
    agenda = section(sections, "agenda")
    agenda.update(eyebrow=text(60), heading=text(61), body=text(62))
    set_buttons(agenda, 63)


def apply_speakers(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "page-hero")
    hero.update(heading=text(65), body=text(66))
    set_buttons(hero, 67)
    intro = section(sections, "page-introduction")
    intro.update(eyebrow=text(68), heading=text(69), body=text(70))
    categories = section(sections, "speaker-categories")
    categories.pop("eyebrow", None)
    categories.update(heading=text(71), body=text(72))
    set_cards(categories, list(range(73, 80)))
    directory = section(sections, "all-speakers")
    directory.update(eyebrow=text(80), heading=text(81), body=text(82))
    listed_speakers = directory.get("speakers", [])
    senior_entries = re.split(r"\s+(?=قيادة عليا)", text(83))
    for speaker, entry in zip(listed_speakers[:3], senior_entries):
        detail = entry.split(" — ", 1)[1]
        name, combined_role = detail.split("، ", 1)
        workplace = str(speaker.get("workplace") or "")
        role = combined_role.removesuffix(f" {workplace}") if workplace else combined_role
        speaker.update(name=name, role=role, workplace=workplace or None)

    remaining_entries = re.split(
        r"\s+(?=(?:اللواء البحري البروفيسور|اللواء الركن|العقيد البحري|البروفيسورة|البروفيسور|الأستاذ|العميد البحري|مايك|د\.))",
        text(84),
    )
    remaining_entries[0:2] = [" ".join(remaining_entries[0:2])]
    remaining_entries[4:6] = [" ".join(remaining_entries[4:6])]
    for speaker, entry in zip(listed_speakers[3:], remaining_entries):
        name, details = entry.split(" — ", 1)
        if "، " in details:
            role, workplace = details.rsplit("، ", 1)
        else:
            role, workplace = details, None
        speaker.update(name=name, role=role, workplace=workplace)
    conversion = section(sections, "conversion")
    conversion.update(eyebrow=text(85), heading=text(86), body=text(87))
    set_buttons(conversion, 88)


def apply_partners(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "page-hero")
    hero.update(heading=text(90), body=text(91))
    set_buttons(hero, 92)
    intro = section(sections, "page-introduction")
    intro.update(eyebrow=text(93), heading=text(94), body=text(95))
    directory = section(sections, "partner-directory-intro")
    directory.update(eyebrow=text(96), heading=text(97), body=text(98))
    conversion = section(sections, "conversion")
    conversion.update(heading=text(100), body=text(101))
    set_buttons(conversion, 102)


def apply_b2g(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "page-hero")
    hero.update(
        heading=text(104),
        body=text(105),
        note=text(106),
    )
    set_buttons(hero, 108)
    hero["eventDetails"][0].update(label="التاريخ", value="23–25 نوفمبر 2026")
    hero["eventDetails"][1].update(label="المكان", value="فندق ومركز مؤتمرات سوفيتيل الرياض")

    intro = section(sections, "page-introduction")
    intro.update(eyebrow=text(109), heading=text(110), body=text(111))
    executive = section(sections, "executive-track")
    set_cards(executive, [112, 113, 114, 115])

    strategic = section(sections, "strategic-value")
    strategic.update(eyebrow=text(116), heading=text(117), body=text(118))
    set_cards(strategic, [119, 120, 121, 122, 123])

    priority = section(sections, "priority-areas")
    priority.update(eyebrow=text(124), heading=text(125), body=text(126))
    set_cards(priority, [127, 128, 129, 130, 131, 132])

    ecosystem = section(sections, "engagement-ecosystem")
    ecosystem.update(
        eyebrow=text(133),
        heading=text(134),
        body="\n\n".join([text(135), *[text(i) for i in range(136, 143)], text(143)]),
    )

    journey = section(sections, "journey")
    journey.update(eyebrow=text(144), heading=text(145))
    set_cards(journey, [146, 147, 148, 149, 150, 151], "steps")

    included = section(sections, "included")
    included.update(eyebrow=text(152), heading=text(153), body=text(154))
    set_cards(included, list(range(155, 163)))

    benefits = section(sections, "benefits")
    benefits.update(eyebrow=text(163), heading=text(164), body=text(165))
    benefit_ranges = [(166, 167, 173), (174, 175, 186), (187, 188, 193)]
    for card, (title_number, start, end) in zip(benefits.get("cards", []), benefit_ranges):
        card["title"] = re.sub(r"^\d{2}\s*[—-]\s*", "", text(title_number))
        card["body"] = "\n".join(text(i) for i in range(start, end + 1))

    participation = section(sections, "participation-format")
    participation.update(eyebrow=text(194), heading=text(195), body=text(196))
    if participation.get("ctaLabel") is not None:
        participation["ctaLabel"] = buttons(197)[0]

    eligibility = section(sections, "eligibility")
    eligibility.update(eyebrow=text(198), heading=text(199), body=text(200))
    for card, number in zip(eligibility.get("cards", []), range(201, 207)):
        card["title"] = text(number)
    eligibility["note"] = text(207)

    application = section(sections, "application")
    application.update(eyebrow=text(208), heading=text(209), body=text(210), privacyNote=text(220))

    faq = section(sections, "faq")
    faq["heading"] = text(222)
    set_cards(faq, list(range(223, 229)))

    conversion = section(sections, "conversion")
    conversion.update(eyebrow=text(229), heading=text(230), body=text(231))
    set_buttons(conversion, 232)


def apply_legacy(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "page-hero")
    hero.update(heading=text(234), body=text(235))
    intro = section(sections, "page-introduction")
    intro.update(eyebrow=text(236), heading=text(237), body=text(238))
    editions = section(sections, "previous-editions")
    editions["heading"] = text(239)
    set_cards(editions, [240, 241, 242], "steps")
    evolution = section(sections, "strategic-evolution")
    evolution.update(eyebrow=text(243), heading=text(244))
    set_cards(evolution, [245, 246, 247, 248], "steps")
    continuation = section(sections, "legacy-continues")
    continuation.update(
        eyebrow=text(249),
        heading=text(250),
        body=f"{text(251)}\n\n{text(252)}\n\n{text(253)}",
    )


def apply_contact(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "page-hero")
    hero.update(heading=text(266), body=text(267))
    details = section(sections, "contact-details")
    details.update(heading=text(268), body=text(269))
    form = section(sections, "contact-form")
    form.update(heading=text(271), body=text(272), privacyNote=text(281))


def apply_updates_page(sections: list[dict]) -> None:
    set_navigation(sections)
    hero = section(sections, "updates-top")
    hero.update(heading=text(256), body=text(257), eyebrow=text(255))
    conversion = section(sections, "updates-cta")
    conversion.update(eyebrow=text(261), body=text(262))
    set_buttons(conversion, 264)


def apply_navigation_only(sections: list[dict]) -> None:
    set_navigation(sections)


APPLIERS = {
    "simf-microsite-home": apply_home,
    "simf-microsite-programme": apply_programme,
    "simf-microsite-speakers": apply_speakers,
    "simf-microsite-partners": apply_partners,
    "simf-microsite-government-b2g": apply_b2g,
    "simf-microsite-legacy": apply_legacy,
    "simf-microsite-updates": apply_updates_page,
    "simf-microsite-contact": apply_contact,
    "simf-microsite-sponsor": apply_navigation_only,
}


with sqlite3.connect(DATABASE) as database:
    database.row_factory = sqlite3.Row
    rows = database.execute(
        """
        select pl.id, p.page_type, pl.sections
        from pages_locales pl
        join pages p on p.id = pl._parent_id
        where pl._locale = 'ar'
        """
    ).fetchall()
    updated = []
    for row in rows:
        apply = APPLIERS.get(row["page_type"])
        if not apply:
            continue
        sections = json.loads(row["sections"] or "[]")
        apply(sections)
        database.execute(
            "update pages_locales set sections = ? where id = ?",
            (json.dumps(sections, ensure_ascii=False, separators=(",", ":")), row["id"]),
        )
        updated.append(row["page_type"])

    page_meta = {
        "simf-microsite-home": ("الرئيسية", text(5)),
        "simf-microsite-programme": ("البرنامج", text(36)),
        "simf-microsite-speakers": ("المتحدثون", text(66)),
        "simf-microsite-partners": ("الرعاة والشركاء", text(91)),
        "simf-microsite-government-b2g": ("فرص B2G", text(105)),
        "simf-microsite-legacy": ("نسخ سابقة", text(235)),
        "simf-microsite-updates": (text(255), text(257)),
        "simf-microsite-contact": ("تواصل معنا", text(267)),
    }
    for page_type, (title, summary) in page_meta.items():
        database.execute(
            """
            update pages_locales
            set title = ?, summary = ?, seo_title = ?, seo_description = ?
            where _locale = 'ar' and _parent_id = (
              select id from pages where page_type = ? limit 1
            )
            """,
            (title, summary, f"{title} | الملتقى البحري السعودي الدولي 2026", summary, page_type),
        )

    form_updates = {
        "simf-b2g-application": {
            "submit": buttons(221)[0],
            "labels": [text(i).removesuffix(" *") for i in range(211, 220)],
        },
        "simf-contact": {
            "submit": buttons(282)[0],
            "labels": [text(i).removesuffix(" *") for i in range(273, 281)],
        },
    }
    for form_key, values in form_updates.items():
        form_row = database.execute(
            "select id from forms where form_key = ? limit 1",
            (form_key,),
        ).fetchone()
        if not form_row:
            raise RuntimeError(f"Required form not found: {form_key}")
        form_id = form_row["id"]
        database.execute(
            "update forms_locales set submit_label = ? where _locale = 'ar' and _parent_id = ?",
            (values["submit"], form_id),
        )
        for order, label in enumerate(values["labels"], 1):
            database.execute(
                "update forms_fields set label = ? where _locale = 'ar' and _parent_id = ? and _order = ?",
                (label, form_id, order),
            )

    update_fields = [
        (1, "أخبار الملتقى", "انطلاق الأعمال التحضيرية لإقامة الملتقى البحري السعودي الدولي الرابع – نوفمبر 2026", "أعلنت اللجنة العليا المنظمة بدء الأعمال التحضيرية للنسخة الرابعة من الملتقى، التي تُقام في الرياض خلال الفترة من 23 إلى 25 نوفمبر 2026."),
        (2, "شراكة استراتيجية", "ستارتايم توقع عقد تنظيم الملتقى البحري السعودي الدولي الرابع – نوفمبر 2026", "يمتد الاتفاق بالشراكة الاستراتيجية بين ستارتايم والقوات البحرية الملكية السعودية ودورها في إدارة الفعاليات السيادية الكبرى."),
        (3, "الأجندة الاستراتيجية", "مستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة", "تناقش النسخة الرابعة التحديات الاستراتيجية والتقنية والتشغيلية التي تواجه البنية التحتية في قاع البحار وسلاسل الإمداد العالمية."),
    ]
    for update_id, category, title, summary in update_fields:
        database.execute(
            """update updates_locales
               set category = ?, title = ?, summary = ?, publication_label = 'الملتقى 2026 | يوليو 2026'
               where _locale = 'ar' and _parent_id = ?""",
            (category, title, summary, update_id),
        )

    database.execute("update site_settings set enable_arabic = 1 where id = 1")
    database.commit()

print(json.dumps({"updatedArabicPages": updated, "arabicEnabled": True}, ensure_ascii=False, indent=2))
