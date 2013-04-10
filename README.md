# Regex Binoculars

At Factual's first ever data hackathon in 2013, Rosalyn built a regex-search application that works similarly to a string search tool for reading online. She calls it the Regex Binoculars.

Sometimes you want to search for multiple things at once (example: matching both "party" and "parties"), or you want to search for a street address or email pattern. The regex binoculars allows this flexibility.

## Installation

#### Clone the project:

```bash
$ git clone git@github.com:rosalyn/factual_hackathon.git
```

#### Load the extension

1. Visit `chrome://extensions` in your browser (or open up the Chrome menu by clicking the icon to the far right of the Omnibox, and select **Extensions** under the **Tools** menu to get to the same place).
2. Click **Load unpacked extension**... to pop up a file-selection dialog.
3. Navigate to the directory in which the extension files live, and select it.

## Basic Usage


  ---------- ------------------------------------------------
    /        Opens up the tool; enter your search request
    n        Find the next match
    N        Find the previous match
    [ENTER]  Search for your regular expression  
    Q        Quit/hide the tool
  ---------- ------------------------------------------------
