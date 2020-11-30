from selenium import webdriver
import csv
from difflib import SequenceMatcher

# Charity Navigator only displays organizations that are tax deductible in the US, so we can scrape
# it to see which organizations on our list are tax deductible in the US

def update_us_tax_deductibility():
    driver = webdriver.Firefox()
    result_rows = []
    with open('../../List of Organisations _ Charities recommended _ donated _ granted to (potentially for GWWC Giving Recommendations page) - Organisations.csv', 'r') as csv_file:
        data_iter = csv.reader(csv_file, delimiter = ',', quotechar = '"')
        for row in data_iter:
            charity_on_sheet_name = row[1]
            driver.get(f'https://www.charitynavigator.org/index.cfm?keyword_list={charity_on_sheet_name}&bay=search.results')
            try:
                charity_on_charitynav_name = driver.find_element_by_css_selector("h3.charity-name-desktop a").get_attribute("text")
                ratio = SequenceMatcher(None, charity_on_sheet_name, charity_on_charitynav_name).ratio()
                if ratio > .8:
                    # the top result on charitynavigator is most likely the same charity from our sheet, so let's update our sheet saying it's US deductible
                    result_rows.append(row + [1])
                elif ratio > .4: 
                    # to make the final sheet, I went through the ones that were printed here manually and picked out the ones that seemed like matches
                    # future updates could automate this gray area better
                    print('unsure about this one: ', charity_on_sheet_name, charity_on_charitynav_name)
                    result_rows.append(row + [0])
                else:
                    result_rows.append(row + [0])
            except Exception:
                # no results for this search
                result_rows.append(row + [0])
    
    with open('../../charities_with_tax_deductibility.csv', 'w', newline='') as myfile:
        wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
        wr.writerows(result_rows)


update_us_tax_deductibility()