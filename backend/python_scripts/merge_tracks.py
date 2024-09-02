import sys
import json
import matplotlib.pyplot as plt
import numpy as np


def main():
    TRACK_PATH = "C:/Users/cjcha/Dev/ReactProjects/DAV_Web_App/backend/images/Tracks"
    tc_list = json.loads(sys.argv[2])
    date = sys.argv[1]
    tc_images = []
    mask = False
    for tc in tc_list:
        with open(f"{TRACK_PATH}/TC/{tc['name']}_{tc['id']}.png", "rb") as image:
            image = plt.imread(image)
        tc_images.append(image)
        mask += (image != 0)

        merged_image = 1
        for tc_image in tc_images:
            tc_image = np.where(tc_image != 0, tc_image, 1)
            merged_image = np.add(merged_image, tc_image) - 1

        merged_image = np.where(mask, merged_image, 0)
        merged_image = np.where(merged_image < 0, 0, merged_image)
        plt.imsave(f"{TRACK_PATH}/DATE/{date}.png", merged_image)



if __name__ == "__main__":
    main()
