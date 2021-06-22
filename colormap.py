import json


gradient = [
    [255, 0, 0],
    [255, 127, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255],
    [75, 0, 130],
    [143, 0, 255],
]

n = 256

colors = []

section = (n - 1) // (len(gradient) - 1)
remainder = (n - 1) % (len(gradient) - 1)

end = 0
for i, _color in enumerate(gradient[:-1]):
    start = end
    end = start + section + (i < remainder)
    for j in range(start, end):
        colors.append([int(round((j - start) / (end - start) *
                      (gradient[i + 1][channel] - gradient[i][channel]) +
                      gradient[i][channel])) for channel in range(3)])
colors.append(gradient[-1])


json.dump({'colormap': colors, 'name': 'Rainbow'}, open('Rainbow.json', 'w'))
