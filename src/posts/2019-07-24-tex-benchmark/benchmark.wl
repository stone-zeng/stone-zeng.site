(* ::Package:: *)

Remove["Global`*"]


SetDirectory[NotebookDirectory[]]


labels = {"minimal", "tikz", "sort", "lipsum", "zhlipsum", "sourcehan"};
prettify = AssociationThread[labels -> Quantity[Around @@@ #, "Seconds"]] &;
data$dvi = prettify /@ <|
  "LaTeX"    -> { {0.173635, 0.015881}, {1.868088, 0.350885}, {0.867857, 0.013035}, {3.945468, 0.448790}, { 5.099667, 0.490719}, {0.867383, 0.127992} },
  "pdfLaTeX" -> { {0.180241, 0.018150}, {1.604758, 0.119790}, {0.853765, 0.007527}, {4.120275, 0.266604}, { 7.000531, 0.779194}, {0.745015, 0.028615} },
  "XeLaTeX"  -> { {0.311213, 0.016967}, {1.726584, 0.173125}, {1.278406, 0.010718}, {8.285161, 0.487356}, {13.888912, 1.165458}, {2.161519, 0.056451} },
  "LuaLaTeX" -> { {0.365213, 0.004556}, {0.996720, 0.066981}, {1.804585, 0.012898}, {5.906478, 0.189940}, { 4.367023, 0.280135}, {7.792491, 0.359169} },
  "upLaTeX"  -> { {0.171857, 0.014081}, {2.174802, 0.119524}, {1.079810, 0.118333}, {4.309285, 0.199801}, { 0.902147, 0.032399}, {0.864133, 0.261331} }
|>;
data$pdf = prettify /@ <|
  "LaTeX"    -> { {0.709194, 0.020344}, {2.619320, 0.173486}, {1.604590, 0.239262}, {4.774309, 0.607056}, { 7.560927, 0.861610}, { 2.528949, 0.138526} },
  "pdfLaTeX" -> { {0.451475, 0.006515}, {1.983102, 0.051629}, {1.421517, 0.285836}, {4.864210, 0.666694}, Null                 , Null                  },
  "XeLaTeX"  -> { {0.846662, 0.030562}, {2.206583, 0.084502}, {1.974251, 0.163328}, {8.696589, 0.467233}, {12.180635, 0.991051}, { 3.340299, 0.271023} },
  "XeLaTeX*" -> { {0.838197, 0.041923}, {2.167815, 0.064843}, {1.893484, 0.071447}, {9.009665, 0.664827}, {11.790877, 0.227755}, { 3.302672, 0.193258} },
  "LuaLaTeX" -> { {0.460425, 0.007071}, {1.085082, 0.054742}, {2.058651, 0.082243}, {7.022748, 0.725202}, { 4.321746, 0.114715}, {14.360480, 0.393364} },
  "upLaTeX"  -> { {0.723859, 0.045331}, {3.009704, 0.099646}, {1.697249, 0.081213}, {5.279584, 0.279460}, { 1.564707, 0.019814}, { 1.857825, 0.129309} },
  "ApLaTeX"  -> { {0.645523, 0.019507}, {2.562748, 0.080381}, Null,                 {5.125441, 0.437490}, { 1.364257, 0.031516}, { 1.555990, 0.093142} }
|>;


chartFunc[data_, legend_, opts: OptionsPattern[]] := BarChart[data,
  ChartLabels     -> Automatic,
  ChartLegends    -> legend,
  BarSpacing      -> {None, 1},
  PlotTheme       -> {"Detailed", "Wide"},
  LabelStyle      -> {FontFamily -> "Roboto"},
  PerformanceGoal -> "Speed",
  ImageSize       -> 600,
  ImagePadding    -> {{20, Automatic}, {Automatic, Automatic}},
  FilterRules[{opts}, Options @ BarChart]]


chartFunc[(# /@ labels) & /@ data$dvi, labels, ChartStyle -> "DeepSeaColors"]
Export["dvi-by-engines.svg", %];
chartFunc[(# /@ labels) & /@ data$pdf, labels, ChartStyle -> "DeepSeaColors"]
Export["pdf-by-engines.svg", %];


chartFunc[Merge[# /@ Keys[#], Flatten], Keys[#], ChartStyle -> "ValentineTones"] & @ data$dvi
Export["dvi-by-tasks.svg", %];
chartFunc[Merge[# /@ Keys[#], Flatten], Keys[#], ChartStyle -> "ValentineTones"] & @ data$pdf
Export["pdf-by-tasks.svg", %];
