from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto("http://localhost:5175/")
    time.sleep(2)
    page.screenshot(path="/home/jules/verification/dark_welcome.png")
    print("Took dark_welcome.png")

    # 2. Click Theme Toggle to Light
    # Wait, the toggle has `display: none` for the radio input?
    # Yes, it's label + input inside.
    # We should click the label.
    # First label is "light", second is "dark".
    try:
        page.locator("label.switcher__option").nth(0).click()
        time.sleep(1) # wait for animation
        page.screenshot(path="/home/jules/verification/light_welcome.png")
        print("Took light_welcome.png")

        # 3. Go to Editor
        file_input = page.locator("input[type='file']")
        if file_input.count() > 0:
            file_input.set_input_files("sample_portrait.jpg")
            page.wait_for_selector("canvas", state="visible")
            time.sleep(3)

            page.screenshot(path="/home/jules/verification/light_editor.png")
            print("Took light_editor.png")

            # Switch back to dark mode
            page.locator("label.switcher__option").nth(1).click()
            time.sleep(1)
            page.screenshot(path="/home/jules/verification/dark_editor.png")
            print("Took dark_editor.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="/home/jules/verification/error_theme.png")
    finally:
        browser.close()
