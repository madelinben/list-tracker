"""
Regenerate src/data/hills.json from the Database of British and Irish Hills (CC BY 4.0).

  curl -LO https://www.hill-bagging.co.uk/dobih-downloads/hillcsv.zip
  python -c "import zipfile; zipfile.ZipFile('hillcsv.zip').extractall('.')"
  python scripts/hills.py DoBIH_v18_6.csv

Item tuple: [number, name, lat, lng, metres, region]
"""

import csv
import json
import sys
from pathlib import Path

LISTS = [
    ("wainwrights", "W", "Wainwrights", "The 214 Lake District fells in Alfred Wainwright's Pictorial Guides."),
    ("munros", "M", "Munros", "The 282 Scottish mountains over 3,000 ft."),
    ("corbetts", "C", "Corbetts", "Scottish hills between 2,500 and 3,000 ft with 500 ft of drop."),
    ("grahams", "G", "Grahams", "Scottish hills between 2,000 and 2,500 ft with 150 m of drop."),
    ("donalds", "D", "Donalds", "Lowland Scotland hills over 2,000 ft."),
    ("hewitts", "Hew", "Hewitts", "Hills in England, Wales and Ireland over 2,000 ft with 30 m of drop."),
]


def main(path: str) -> None:
    rows = list(csv.DictReader(open(path, encoding="utf-8-sig"), skipinitialspace=True))
    out = {
        "source": "Database of British and Irish Hills v18 (CC BY 4.0), hill-bagging.co.uk",
        "lists": [],
    }
    for id_, code, name, blurb in LISTS:
        items = [
            [
                int(r["Number"]),
                r["Name"],
                round(float(r["Latitude"]), 5),
                round(float(r["Longitude"]), 5),
                round(float(r["Metres"])),
                r["Region"].split(":")[-1].strip(),
            ]
            for r in rows
            if code in {c.strip() for c in r["Classification"].split(",")}
        ]
        out["lists"].append({"id": id_, "name": name, "blurb": blurb, "items": items})
        print(f"{name}: {len(items)}")
    target = Path(__file__).resolve().parents[1] / "src/data/hills.json"
    target.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))


if __name__ == "__main__":
    main(sys.argv[1])
