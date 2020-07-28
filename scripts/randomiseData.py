import sys
import random
from datetime import datetime

# Script for randomising evaluation data segment order.

# This script takes 2 files one with English text and one with the translation of the text.
# The script returns 2 files (original and human translation) which contain all 
# the segments from the file provided where the human translation is greater than 14 words
# and where the order of the segments is randomised but remains consistent across the 2 files.
# I.e. segment 1 in the human translation file will still be a translation of segment 1 in
# the original file.

# Specify the files that are to be read in. The list must be in the same order for original, human translation and machine translation.

original_file = "english.txt"
human_translation_file = "translation.txt"

original = open(original_file, "r").readlines()
human_translation = open(human_translation_file, "r").readlines()

if(len(original) != len(human_translation)):
    sys.exit(
    f'Files do not have the same number of lines.')

segments = []

for i in range(len(original)):
    segments.append({
        "original": original[i],
        "human_translation": human_translation[i],
    })

# Randomise the order of the segments
random.shuffle(segments)

# Write the shuffled segments back to files maintaining the order of the segments across the files. i.e. segment 1 in both files will have the same meaning.
# Sentences with fewer than 15 words are excluded.

time = datetime.now().strftime("%d-%m-%Y_%H:%M:%S")

original_randomised = open(f"original_{time}.txt", 'w')
human_translation_randomised = open(f"human_translation_{time}.txt", 'w')

def check_for_new_line(line):
    if(line.endswith('\n') or line.endswith('\r')):
        return line
    else:
        return line + '\n'

for segment in segments:
    o = segment['human_translation'].split(' ')
    if(len(o) >= 15):
        original_randomised.write(check_for_new_line(segment['original']))
        human_translation_randomised.write(check_for_new_line(segment['human_translation']))

original_randomised.close()
human_translation_randomised.close()