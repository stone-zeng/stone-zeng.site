(* ::Package:: *)

Remove["Global`*"]


SetDirectory[NotebookDirectory[]];


plotData[data_, initDate_, forecastDays_, scale_: None] := Module[
  {
    num, ts, tsm, forecast,
    q, err, bands,
    xGrids, color
  },

  num      = Length @ data;
  ts       = TimeSeries[#, {initDate}] & /@ Values[data];
  tsm      = ParallelMap[TimeSeriesModelFit[#, {"ARIMA", {1, 2, 0}}] &, ts];
  forecast = TimeSeriesForecast[#, {0, forecastDays}] & /@ tsm;

  q     = Quantile[NormalDistribution[], 1 - (1 - 0.95) / 2];
  err   = Sqrt[#["MeanSquaredErrors"] & /@ forecast];
  bands = MapThread[
    Function[{forecast, err}, TimeSeriesThread[{{1, -q} . #, {1, q} . #} &, {forecast, err}]],
    {forecast, err}];

  xGrids = DatePlus[DateObject @ initDate, #] & /@
    Range[0, Length @ First @ data + First[forecast]["PathLengths"] // First];
  color = ColorData[99] /@ Range[num];

  Show[
    DateListPlot[Flatten @ {forecast, ts},
      ScalingFunctions -> scale,
      Mesh             -> All,
      PlotRange        -> All,
      PlotTheme        -> "Detailed",
      GridLines        -> {xGrids, Automatic},
      PlotStyle        -> Flatten @ {Directive[#, Opacity @ 0.3] & /@ color, color},
      PlotLabels       -> Keys @ data,
      LabelStyle       -> {FontFamily -> "Roboto"}
    ],
    DateListPlot[Flatten @ Outer[#1["PathComponent", #2] &, bands, {1, 2}],
      ScalingFunctions -> scale,
      PlotRange        -> All,
      Filling          -> Evaluate[2 # - 1 -> {2 #} & /@ Range[num]],
      PlotStyle        -> None,
      FillingStyle     -> Directive[Gray, Opacity @ 0.05]
    ],
    AspectRatio -> 0.6,
    ImageSize   -> 500
  ]
]


Import["2019-nCoV-data.csv"] /. "" -> 0;
Association @ Rest @ MapThread[#1 -> #2 &, {First @ %, Transpose @ Rest @ %}];
data1 = Part[%, Keys @ TakeLargest[Total /@ %[[;;-3]], 11]];
data2 = KeyMap[# /. "\:5168\:56fd" -> "\:611f\:67d3" &] @ %%[[{-3, -2, -1}]];


initDate     = {2020, 1, 11};
forecastDays = 5;


plotData[data1, initDate, forecastDays]
Export["2019-nCoV-new.svg", %];
plotData[data1, initDate, forecastDays, "Log"]
Export["2019-nCoV-new-log.svg", %];
plotData[Accumulate /@ data1, initDate, forecastDays]
Export["2019-nCoV-total.svg", %];
plotData[Accumulate /@ data1, initDate, forecastDays, "Log"]
Export["2019-nCoV-total-log.svg", %];
plotData[data2, initDate, forecastDays]
Export["2019-nCoV-new-death-recovered.svg", %];
plotData[data2, initDate, forecastDays, "Log"]
Export["2019-nCoV-new-death-recovered-log.svg", %];
plotData[Accumulate /@ data2, initDate, forecastDays]
Export["2019-nCoV-death-recovered.svg", %];
plotData[Accumulate /@ data2, initDate, forecastDays, "Log"]
Export["2019-nCoV-death-recovered-log.svg", %];


data = Accumulate @ Flatten @ {data2[[1, 1]], data2[[1, 6;;]]}
nlm = NonlinearModelFit[data, #, {a, b, c, k}, x] & /@
  {a * k^x + c, a / (1 + b * k^x) + c}
#["AdjustedRSquared"] & /@ nlm
Limit[#[x] & /@ nlm, x -> Infinity]
plotFit[plotFunc_: Plot, listPlotFunc_: ListPlot] := Show[
  plotFunc[Evaluate[#[x] & /@ nlm], {x, 0, Length @ data + 10},
    PlotRange   -> {{-0.5, Length @ data + 10.5}, {6, Automatic}},
    PlotTheme   -> "Detailed",
    PlotStyle   -> Flatten @ {Directive[#, Opacity @ 0.3] & /@ ColorData[99] /@ {1, 2}},
    PlotLabels  -> {"Exp", "Logistic"},
    LabelStyle  -> {FontFamily -> "Roboto"},
    PlotLegends -> None
  ],
  listPlotFunc[data,
    PlotTheme -> "Detailed",
    PlotStyle -> ColorData[99][3]
  ],
  AspectRatio -> 0.6,
  ImageSize   -> 500
]
plotFit[]
Export["2019-nCoV-regression.svg", %];
plotFit[LogPlot, ListLogPlot]
Export["2019-nCoV-regression-log.svg", %];
