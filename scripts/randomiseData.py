import sys
import random
from datetime import datetime

# Script for randomising evaluation data segment order.

# This script takes a series of articles that have an original article
# a human translated version of the article and a machine translated article split
# across three text files. The script returns 3 files (original, human translation and
# machine translation) which contain all the segments from the articles provided and
#  where the order of the segments is consistent across the files i.e. segment 1 in
# the human translation file will be a translation of segment 1 in the original file.
# The segments will have been shuffled so that they appear in a random order as opposed
# to the order in the original articles.

# Specify the files that are to be read in. The list must be in the same order for original, human translation and machine translation.
original_filenames = ["bulgarian1HT.txt", "bulgarian2HT.txt",
                      "bulgarian3HT.txt", "bulgarian4HT.txt", "bulgarian5HT.txt", "bulgarian6HT.txt"]
human_translation_filenames = ["bulgarian1EN.txt", "bulgarian2EN.txt",
                               "bulgarian3EN.txt", "bulgarian4EN.txt", "bulgarian5EN.txt", "bulgarian6EN.txt"]
gourmet_translation_filenames = ["bulgarian1MTENgourmet.txt", "bulgarian2MTENgourmet.txt",
                                 "bulgarian3MTENgourmet.txt", "bulgarian4MTENgourmet.txt", "bulgarian5MTENgourmet.txt", "bulgarian6MTENgourmet.txt"]
google_translation_filenames = ["bulgarian1MTENgoogle.txt", "bulgarian2MTENgoogle.txt", "bulgarian3MTENgoogle.txt",
                                "bulgarian4MTENgoogle.txt", "bulgarian5MTENgoogle.txt", "bulgarian6MTENgoogle.txt"]

if(len(original_filenames) != len(human_translation_filenames) or len(human_translation_filenames) != len(gourmet_translation_filenames)) or len(gourmet_translation_filenames) != len(google_translation_filenames):
    sys.exit("Files do not exist for every variation of the articles.")

num_of_files = len(original_filenames)

file_sets = []

# Group the files together by article. This assumes that the files are provided in the lists in the same order
for i in range(num_of_files):
    file_sets.append({
        "original": original_filenames[i],
        "human_translation": human_translation_filenames[i],
        "gourmet_translation": gourmet_translation_filenames[i],
        "google_translation": google_translation_filenames[i]
    })

segments = []

# Read files in and group segments
for file_set in file_sets:
    original = open(file_set['original'], "r").readlines()
    human_translation = open(file_set['human_translation'], "r").readlines()
    gourmet_translation = open(
        file_set['gourmet_translation'], "r").readlines()
    google_translation = open(file_set['google_translation'], "r").readlines()

    if(len(original) != len(human_translation) or len(human_translation) != len(gourmet_translation)) or len(gourmet_translation) != len(google_translation):
        sys.exit(
            f'Files do not have the same number of lines in file set: {file_set}.')

    for i in range(len(original)):
        segments.append({
            "original": original[i],
            "human_translation": human_translation[i],
            "gourmet_translation": gourmet_translation[i],
            "google_translation": google_translation[i]
        })

# Randomise the order of the segments
random.shuffle(segments)

# Write the shuffled segments back to files maintaining the order of the segments across the files. i.e. segment 1 in all files will have the same meaning.
# Sentences with fewer than 12 words are excluded.

time = datetime.now().strftime("%d-%m-%Y_%H:%M:%S")

original = open(f"original_{time}.txt", 'w')
human_translation = open(f"human_translation_{time}.txt", 'w')
gourmet_translation = open(f"gourmet_translation_{time}.txt", 'w')
google_translation = open(f"google_translation_{time}.txt", 'w')

for segment in segments:
    o = segment['human_translation'].split(' ')
    if(len(o) >= 12):
        original.write(segment['original'])
        human_translation.write(segment['human_translation'])
        gourmet_translation.write(segment['gourmet_translation'])
        google_translation.write(segment['google_translation'])

original.close()
human_translation.close()
gourmet_translation.close()
google_translation.close()
