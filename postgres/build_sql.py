import csv
import sys


def csv_to_dict(file_name):
    try:
        with open(file_name, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            data = [row for row in reader]
            return data
    except FileNotFoundError:
        print(f"Error: The file '{file_name}' was not found.")
        return None


def create_main_table():
    text = "\n-- create product table\n"
    text += "CREATE TABLE product(\n"
    text += "\tid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n"
    text += "\tprod_id VARCHAR(16) UNIQUE NOT NULL,\n"
    text += "\torder_id VARCHAR(16) UNIQUE NOT NULL,\n"
    text += "\tmaterial_cost INT,\n"
    text += "\tlabor_cost INT\n"
    text += ");\n"
    return text


def create_module_table(name):
    text = f"\n-- create {name} table\n"
    text += f"CREATE TABLE {name}(\n"
    text += "\tid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n"
    text += "\torder_id VARCHAR(16) NOT NULL,\n"
    text += "\tmaterial_cost INT,\n"
    text += "\tlabor_cost INT,\n"
    text += "\tCONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES product (order_id)\n"
    text += ");\n"
    return text


def insert_main_table(rows):
    text = "\n-- insert data to product table\n"
    text += f"INSERT INTO\n"
    text += f"\tproduct (prod_id, order_id, material_cost, labor_cost)\n"
    text += f"VALUES\n"
    for i, data in enumerate(rows):
        id = data.get("id", None)
        order_id = data.get("order_id", None)
        material_cost = data.get("material_cost", None)
        labor_cost = data.get("labor_cost", None)
        text += "\t(\n"
        text += f"\t\t'{id}',\n"
        text += f"\t\t'{order_id}',\n"
        text += f"\t\t{material_cost},\n"
        text += f"\t\t{labor_cost}\n"
        if (i < len(rows)-1):
            comma = ","
        else:
            comma = ";"
        text += f"\t){comma}\n"
    return text


def insert_module_table(name, rows):
    text = f"\n-- insert data to {name} table\n"
    text += f"INSERT INTO\n"
    text += f"\t{name} (order_id, material_cost, labor_cost)\n"
    text += f"VALUES\n"
    for i, data in enumerate(rows):
        order_id = data.get(f"order_id", None)
        material_cost = data.get(f"{name}-material_cost", None)
        labor_cost = data.get(f"{name}-labor_cost", None)
        text += "\t(\n"
        text += f"\t\t'{order_id}',\n"
        text += f"\t\t{material_cost},\n"
        text += f"\t\t{labor_cost}\n"
        if (i < len(rows)-1):
            comma = ","
        else:
            comma = ";"
        text += f"\t){comma}\n"
    return text


def main(data):
    # get module names
    module_names = set()
    for text in data[0].keys():
        if "-" in text:
            module_names.add(text.split("-")[0])
    module_names = list(module_names)

    # create sql script
    text = ""
    # create table
    text += create_main_table()
    for name in module_names:
        text += create_module_table(name)
    # insert data
    text += insert_main_table(data)
    for name in module_names:
        text += insert_module_table(name, data)

    return text


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python csv_to_dict.py <csv_file>")
    else:
        file_name = sys.argv[1]
        result = main(csv_to_dict(file_name))
        if result is not None:
            with open("database.sql", "w") as file:
                file.write(result)
