import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

url = "https://www.loreal-finance.com.cn/en/annual-report-2019/brands-overview-3-2-0/"

options = webdriver.ChromeOptions()
options.add_argument("--headless")  
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.get(url)
time.sleep(5)  # wait for JS

all_data = {}

divisions = driver.find_elements(By.CSS_SELECTOR, "div.brands__division")

for division in divisions:
    try:
        division_name = division.find_element(By.TAG_NAME, "h2").text.strip()
    except:
        division_name = "Unknown Division"

    print(f"Processing division: {division_name}")
    all_data[division_name] = []

    brands = division.find_elements(By.CSS_SELECTOR, "div.brand-list__item")

    for brand in brands:
        try:
            brand_name = brand.find_element(By.CSS_SELECTOR, "div.brand-list__name").text.strip()
            print(" → Found brand:", brand_name)

            # click to open modal
            driver.execute_script("arguments[0].click();", brand)

            # wait for description
            desc_elems = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#maxlite-description div"))
            )

            description = " ".join([d.text.strip() for d in desc_elems if d.text.strip()])

            all_data[division_name].append({
                "brand": brand_name,
                "description": description
            })

            # close modal
            close_btn = driver.find_element(By.CSS_SELECTOR, "button.brands__detail-close")
            driver.execute_script("arguments[0].click();", close_btn)
            time.sleep(1)

        except Exception as e:
            print(f"⚠️ Error on brand: {e}")


driver.quit()

# save to JSON
with open("loreal_brands.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print("✅ Done. Data saved to loreal_brands.json")
