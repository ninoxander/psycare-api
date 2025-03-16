import pandas as pd
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
csv_path = os.path.join(base_dir, "data.csv")
readme_path = os.path.join(base_dir, "README.md")

df = pd.read_csv(csv_path)

total_implemented = df[df["IMPLEMENTED"] == "TRUE"].shape[0]
total_endpoints = df.shape[0]
percent_implemented = (total_implemented / total_endpoints) * 100

markdown_table = df.to_markdown(index=False)

with open(readme_path, "r") as file:
    readme = file.readlines()

start = readme.index("<!-- START_TABLE -->\n") + 1

# Buscar la línea que contiene <!-- END_TABLE --> sin espacios adicionales
end = None
for i, line in enumerate(readme):
    if line.strip() == "<!-- END_TABLE -->":
        end = i
        break

if end is None:
    raise ValueError("No se encontró el marcador <!-- END_TABLE --> en el archivo README.md")

progress_bar = f"![](https://geps.dev/progress/{int(percent_implemented)})"
readme[start:end] = [markdown_table + "\n\n**Total Coverage: {}%**\n{}".format(round(percent_implemented, 2), progress_bar)]


with open(readme_path, "w") as file:
    file.writelines(readme)

print("README actualizado con los datos de data.csv")