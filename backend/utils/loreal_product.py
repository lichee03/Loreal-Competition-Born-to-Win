import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

base_url = "https://www.lorealparis.com.my/products?page={}"
all_products = []

options = webdriver.ChromeOptions()
options.add_argument("--headless")  # run silently
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # Loop pages 1 to 7
    for i in range(1, 8):
        driver.get(base_url.format(i))
        time.sleep(2)

        products = driver.find_elements(By.CSS_SELECTOR, "#filterList div article header div p a")

        for p in products:
            title = p.text.strip()
            href = p.get_attribute("href")

            # go into product page
            driver.get(href)
            time.sleep(2)

            try:
                desc_elems = driver.find_elements(By.XPATH, '//*[@id="maxlite-description"]/div[2]/div')
                description = "\n\n".join([d.text.strip() for d in desc_elems if d.text.strip()])
            except:
                description = None

            all_products.append({
                "title": title,
                "description": description
            })

            # back to product list
            driver.back()
            time.sleep(2)

finally:
    driver.quit()

# Save to JSON file
with open("loreal_products.json", "w", encoding="utf-8") as f:
    json.dump(all_products, f, ensure_ascii=False, indent=2)

print(f"✅ Saved {len(all_products)} products from 7 pages into loreal_products.json")
