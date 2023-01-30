import glob
import os
import shutil


def save_string_to_file(file, string):
    with open(file, "w") as file:
        print(string, file=file)


def save_to_file(file, content):
    with open(file, "wb") as file:
        file.write(content)


def read_file_to_string(file):
    with open(file, 'r') as file:
        content = file.read()

    return content


def read_file_to_list_of_strings(file):
    with open(file, 'r') as file:
        result = file.read().splitlines()

    return result


def create_dirs(dir):
    if not os.path.exists(dir):
        os.makedirs(dir)


def remove_dir(dir):
    shutil.rmtree(dir, ignore_errors=True)


def get_filenames_in_dir(dir, pattern, recursive=False):
    glob_pattern = f'**/{pattern}' if recursive else pattern
    return glob.glob(os.path.join(dir, glob_pattern), recursive=recursive)


def get_subfolders(dir):
    return [d for d in os.listdir(dir) if os.path.isdir(os.path.join(dir, d))]
