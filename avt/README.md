# Getting Started

## Generating training data

1. Get PDFs of a specific user flow you want to automate. For example, signing an order. Place the signature in various parts of the PDF.
2. Install `pdf2pic` dependencies (found via `avt/training-data/package.json`) via `brew install gs graphicsmagick`
3. Install dependencies, via `npm i`.
4. Run the script via `npm run convert <directory>` where `<directory>` is the directory within the `training-data` directory. For example, for `training-data/sign-order`, we'd need to run `npm run convert <sign-order>`

## LabelImg

1. First, you'll need to clone the repository from `https://github.com/tzutalin/labelImg`.
2. Now, we'll need to run the recommended instructions for macOS; however, these had to be modified:

**Note:** Instructions for other platforms are available on the repository's README document.

```bash
brew install python3
pip3 install pipenv
pipenv run pip install pyqt5 lxml
pipenv run make qt5py3
pipenv run python3 labelImg.py
```

3. Once you're running it, open the necessary training data directory. For this example, we'll be using `avt/training-data/sign-order`.
4. Once you open the directory, start drawing the rectangles around the object and labeling them with the _exact_ same label and **get them as close as you can.**

**Note:** Make sure to save in the `annotations` directory. See `sign-order/annotations` for examples!

<insert demo>

5. After saving, click the `Next Image` button and repeat until you're finished.
6. After labeling all of the training data, we'll need to generate the annotations for the training data via `npm run convert-annotations <prefix>`. For example: `npm run convert-annotations sign-order`.