import pandas as pd
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  
csv_path = os.path.join(base_dir, "data.csv")
readme_path = os.path.join(base_dir, "README.md")

df = pd.read_csv(csv_path)

coverage_columns = df.columns[1:]

def convert_to_numeric(value):
    weights = {
        "Basic": 25,
        "Medium": 50,
        "Full": 100
    }
    return weights.get(value, 0)

df_numeric = df.copy()
for col in coverage_columns:
    df_numeric[col] = df[col].map(convert_to_numeric)

df["% Coverage"] = df_numeric[coverage_columns].mean(axis=1).round(2)

total_coverage = df["% Coverage"].mean().round(2)

markdown_table = df.to_markdown(index=False)

with open(readme_path, "r") as file:
    readme = file.readlines()

start = readme.index("<!-- START_TABLE -->\n") + 1
end = readme.index("<!-- END_TABLE -->\n")
readme[start:end] = [markdown_table + "\n\n**Total Coverage: {}%**\n".format(total_coverage)]

with open(readme_path, "w") as file:
    file.write("### API Coverage\n")
    file.write("Based on Bruno Docs\n\n")
    file.writelines(readme)

print("README actualizado con los datos de data.csv")