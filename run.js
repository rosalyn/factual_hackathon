var isSearchActive = false;
var markers = null;
var highlightedIndex = 0;
var lastHighlightedIndex = 0;

var ENTER_KEY = 13;
var PREVIOUS_KEY = 78;
var NEXT_KEY = 110;
var FWRD_SLASH_KEY = 47;

function handleSearchPattern(e) {
  var nodeName = e.target.nodeName;

  if (e.keyCode == FWRD_SLASH_KEY && !e.shiftKey && !e.ctrlKey && !e.altKey) {
    isSearchActive = false;
    if (nodeName != 'TEXTAREA' && (nodeName != "INPUT" || isAllowedType(e.target.type))) {
      showRegexSearchPanel();
      e.stopPropagation();
      e.preventDefault();
    }
  }
 
  else if (isSearchActive) {
    if (e.keyCode == PREVIOUS_KEY && !e.ctrlKey && !e.altKey) {
      init();
      lastHighlightedIndex = highlightedIndex;
      if (highlightedIndex < markers.length - 1)
        highlightedIndex++;
      else
        highlightedIndex = 0;
      highlightCurrentMatch();
    }
    else if (e.keyCode == NEXT_KEY && !e.ctrlKey && !e.altKey) {
      init();
      lastHighlightedIndex = highlightedIndex;
      if (highlightedIndex > 0)
        highlightedIndex--;
      else
        highlightedIndex = markers.length - 1;
      highlightCurrentMatch();
    }
  }
}

function init() {
  if (markers != null)
    return;

  markers = [];
  highlightedIndex = -1;
  var spans = document.getElementsByTagName("span");
  for (var i = spans.length - 1; i >= 0; i--) {
    if (spans[i].className == "highlight") {
      markers.push(spans[i]);
    }
  }
}

function highlightCurrentMatch() {
  // Highlight all matches in yellow
  if (markers[lastHighlightedIndex])
    markers[lastHighlightedIndex].style.backgroundColor = "yellow";
  markers[highlightedIndex].scrollIntoView();
  markers[highlightedIndex].style.backgroundColor = "orange";
}

function showRegexSearchPanel() {
  var input = createRegexSearchPanel();
  panel = document.getElementById("regexSearchPanel");
  panel.style.display = "block";
  input.focus();
  input.select();
}

function isAllowedType(type) {
  return type == "button" || type == "checkbox" || type == "image" || type == "radio" || type == "reset" || type == "submit";
}

function highlightMatches(regex, node, totalMatched) {
  var tags_regex = /<[^<>]*>/ig;
  var HTMLarray = node.innerHTML.match(tags_regex);
  // Replace HTML tags
  var strippedHTML = node.innerHTML.replace(tags_regex, "$!$");

  // Replace search words
  var temp = strippedHTML.replace(regex, '<span class="highlight">$1</span>');

  // Reinsert HTML
  for (var i = 0; temp.indexOf("$!$") > -1; i++) {
    temp = temp.replace("$!$", HTMLarray[i]);
  }

  // Display result
  node.innerHTML = temp;

  var span_tags_regex = /<span class="highlight">/ig;
  var spans = node.innerHTML.match(span_tags_regex);
  totalMatched = spans.length;

  return totalMatched;
}

function clearSearch(node) {
  var highlight_tags_regex = /(<span class="highlight"[^<>]*>)([^<>]*)(<\/span>)/ig;
  var temp = node.innerHTML.replace(highlight_tags_regex, "$2");
  node.innerHTML = temp;
  isSearchActive = false;
  markers = null;
}

function createRegexSearchPanel() {
  var left = (top.innerWidth - 200);
  panel = document.createElement("div");
  panel.id = "regexSearchPanel";
  panel.style.position = "fixed";
  panel.style.zIndex = "10000";
  panel.style.top = "0px";
  panel.style.left = left + "px";
  panel.style.padding = "0px 2px 2px 2px";
  panel.style.backgroundColor = "white";
  panel.style.borderBottom = "1px solid black";
  panel.style.borderLeft = "1px solid black";
  panel.style.borderRight = "1px solid black";
  var input = document.createElement("input");
  input.id = "regexSearchInput";
  input.type = "text";
  input.onblur = function(e) { panel.style.display = "none"; }
  input.onkeypress = function(e) {
    if (e.keyCode == ENTER_KEY && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      panel.style.display = "none";
      input.blur();
      var searchExpression = input.value;
      if (searchExpression == "") {
        // Don't match, don't do anything
        clearSearch(document.body);
        // Clean up any structural problems in the original HTML
        document.body.normalize();
      }
      else {
        // Clear previous search
        clearSearch(document.body);
        var regex = new RegExp("(" + searchExpression + ")", "g");
        var totalMatched = highlightMatches(regex, document.body, 0);
        if (totalMatched > 0) {
          isSearchActive = true;
        }
      }
    }
  }
  panel.appendChild(input);
  document.body.appendChild(panel);
  return input;
}

document.addEventListener("keypress", handleSearchPattern, false);
