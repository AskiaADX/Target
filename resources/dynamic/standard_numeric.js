/* standard_numeric.js */
{% 
Dim i 
Dim ar = CurrentQuestion.ParentLoop.AvailableResponses
Dim inputName
For i = 1 To ar.Count 
	inputName = CurrentQuestion.Iteration(ar[i].Index).InputName()
%}
	{element : $('#{%= inputName%}')}{%= On(i < ar.Count, ",", "") %}
{% Next %}