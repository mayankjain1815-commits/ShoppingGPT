import os
import sqlite3

os.environ.setdefault("GOOGLE_API_KEY", "test-key")


def test_configured_data_paths_exist():
    from shoppinggpt.config import DATA_PRODUCT_PATH, DATA_TEXT_PATH, STORE_DIRECTORY

    assert os.path.isfile(DATA_PRODUCT_PATH), f"missing {DATA_PRODUCT_PATH}"
    assert os.path.isfile(DATA_TEXT_PATH), f"missing {DATA_TEXT_PATH}"
    assert os.path.isdir(STORE_DIRECTORY), f"missing {STORE_DIRECTORY}"


def test_product_database_is_queryable():
    from shoppinggpt.config import DATA_PRODUCT_PATH

    conn = sqlite3.connect(DATA_PRODUCT_PATH)
    try:
        tables = {
            row[0]
            for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            )
        }
    finally:
        conn.close()
    assert "products" in tables
