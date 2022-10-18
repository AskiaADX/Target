/* standard.js */
$(window).on("load", function() {
	$('#adc_{%= CurrentADC.InstanceId %}').adcTarget({
		maxWidth : '{%= CurrentADC.PropValue("maxWidth") %}',
		controlWidth : '{%= CurrentADC.PropValue("controlWidth") %}',
		maxImageWidth : '{%= CurrentADC.PropValue("maxImageWidth") %}',
		maxImageHeight : '{%= CurrentADC.PropValue("maxImageHeight") %}',
		forceImageSize : '{%= CurrentADC.PropValue("forceImageSize") %}',
		animationSpeed : '{%= CurrentADC.PropValue("animationSpeed") %}',
		showResponseHoverColour: {%= (CurrentADC.PropValue("showResponseHoverColour") = "1") %},
		showResponseHoverFontColour: {%= (CurrentADC.PropValue("showResponseHoverFontColour") = "1") %},
		showResponseHoverBorder: {%= (CurrentADC.PropValue("showResponseHoverBorder") = "1") %},
		controlAlign : '{%= CurrentADC.PropValue("controlAlign") %}',
		autoImageSize: {%= (CurrentADC.PropValue("autoImageSize") = "1") %},
		stackResponses: {%= (CurrentADC.PropValue("stackResponses") = "1") %},
		selectNextResponse: {%= (CurrentADC.PropValue("selectNextResponse") = "1") %},
		autoStackWidth: '{%= CurrentADC.PropValue("autoStackWidth") %}',
		fontSize: '{%= CurrentADC.PropValue("fontSize") %}',
    scaleMin : {%= CurrentQuestion.MinValue %},
    scaleMax : {%= CurrentQuestion.MaxValue %},
    innerCircleWidth : {%= CurrentADC.PropValue("innerCircleWidth") %},
		maxValueAtCenter: {%= (CurrentADC.PropValue("maxValueAtCenter") = "1") %},
    innerCircleImageWidth : '{%= CurrentADC.PropValue("innerCircleImageWidth") %}',
    innerCircleImageHeight : '{%= CurrentADC.PropValue("innerCircleImageHeight") %}',
    circleBorderWidth : '{%= CurrentADC.PropValue("circleBorderWidth") %}',
    useAltCircle: {%= (CurrentADC.PropValue("useAltCircle") = "1") %},
  	targetHorizontalPosition : '{%= CurrentADC.PropValue("targetHorizontalPosition") %}',
		targetVerticalPosition : '{%= CurrentADC.PropValue("targetVerticalPosition") %}',
  	currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
		iterations: [
  		{%:= CurrentADC.GetContent("dynamic/standard_numeric.js").ToText()%}
		]
	});
});
