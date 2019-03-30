## Watch files and rebuild PDF

`ls *.tex | entr sh -c "xelatex -interaction=nonstopmode thesis && bibtex thesis && xelatex -interaction=nonstopmode thesis.tex && xelatex -interaction=nonstopmode thesis.tex"`

Open PDF in buffer and `M-x auto-revert-mode`
