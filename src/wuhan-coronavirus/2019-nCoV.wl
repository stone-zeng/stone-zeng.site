(* ::Package:: *)

(* ::Title:: *)
(*SARS-CoV-2 Data Analysis*)


Remove["Global`*"]


SetDirectory @ NotebookDirectory[];


(* ::Section:: *)
(*Time series analysis*)


plotData[data_, initDate_, forecastDays_, scale_: None] := Module[
  {
    num, ts, tsm, forecast,
    q, err, bands,
    xGrids, color
  },

  num      = Length @ data;
  ts       = TimeSeries[#, {initDate}] & /@ Values[data];
  tsm      = ParallelMap[TimeSeriesModelFit[#(*, {"ARIMA", {1, 2, 0}}*)] &, ts];
  forecast = TimeSeriesForecast[#, {0, forecastDays}] & /@ tsm;

  q     = Quantile[NormalDistribution[], 1 - (1 - 0.95) / 2];
  err   = Sqrt[#["MeanSquaredErrors"] & /@ forecast];
  bands = MapThread[
    Function[{forecast, err}, TimeSeriesThread[{{1, -q} . #, {1, q} . #} &, {forecast, err}] ],
    {forecast, err}];

  xGrids = DatePlus[DateObject @ initDate, #] & /@
    Range[0, Length @ First @ data + First[forecast]["PathLengths"] // First];
  color = ColorData[99] /@ Range[num];

  Show[
    DateListPlot[Flatten @ {forecast, ts},
      PlotRange        -> All,
      PlotTheme        -> "Detailed",
      GridLines        -> {xGrids, Automatic},
      LabelStyle       -> {FontFamily -> "Roboto"},
      Mesh             -> All,
      PlotLabels       -> Keys @ data,
      PlotStyle        -> Flatten @ {Directive[#, Opacity @ 0.3] & /@ color, color},
      ScalingFunctions -> scale
    ],
    DateListPlot[Flatten @ Outer[#1["PathComponent", #2] &, bands, {1, 2}],
      PlotRange        -> All,
      Filling          -> Evaluate[2 # - 1 -> {2 #} & /@ Range[num] ],
      FillingStyle     -> Directive[Gray, Opacity @ 0.05],
      PlotStyle        -> None,
      ScalingFunctions -> scale
    ],
    AspectRatio -> 0.6,
    ImageSize   -> 500
  ]
]


Import["2019-nCoV-data.csv"] /. "" -> 0;
Association @ Rest @ MapThread[#1 -> #2 &, {First @ %, Transpose @ Rest @ %}];
data1 = Append[Part[%, Keys @ TakeLargest[Total /@ %[[;;-3]], 11] ],
  "\:6e56\:5317\:4ee5\:5916" -> Total @ %[[2;;-4]]];
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


(* ::Section:: *)
(*Regression analysis*)


data = AssociationThread[{"\:5168\:56fd", "\:6e56\:5317\:4ee5\:5916"} ->
  PadLeft[Accumulate /@ {Flatten @ {data2[[1, 1]], data2[[1, 6;;]]}, data1[[-1]][[9;;]]}] ];
nlm = NonlinearModelFit[#, {a / (1 + b * k^x) + c, 0 < k < 10, b > 0}, {a, b, c, k}, x] & /@ data;
Outer[#1 @ #2 &, Values @ nlm, {"RSquared", "AdjustedRSquared", "ParameterTable"}] // TableForm
Limit[#[x], x -> Infinity] & /@ nlm


plotFit[plotFunc_: Plot, listPlotFunc_: ListPlot] := Module[
  {dataLength, xGrids, ticks},

  dataLength = Length @ First @ data + 10;
  xGrids     = Range[1, dataLength, 7];
  ticks      = {
    Automatic,
    {
      Function[{initDate, dateSpec}, {#, DateString[DatePlus[initDate, #], dateSpec]} & /@ xGrids]
      @@ {DateObject[{2020, 1, 15}], {"MonthNameShort", " ", "Day"}},
      None
    }
  };

  Show[
    plotFunc[Evaluate @ Values[#[x] & /@ nlm], {x, 0, dataLength},
      PlotRange   -> {{-0.5, dataLength + 0.5}, {6, Automatic}},
      PlotTheme   -> "Detailed",
      FrameTicks  -> ticks,
      GridLines   -> {xGrids, Automatic},
      LabelStyle  -> {FontFamily -> "Roboto"},
      PlotLabels  -> Keys @ data,
      PlotLegends -> None,
      PlotStyle   -> Evaluate[Directive[ColorData[99][#], Opacity @ 0.3] & /@ {1, 2}]
    ],
    listPlotFunc[data,
      PlotTheme   -> "Detailed",
      PlotLegends -> None,
      PlotStyle   -> Evaluate[ColorData[99][#] & /@ {1, 2}]
    ],
    AspectRatio -> 0.6,
    ImageSize   -> 500
  ]
]


plotFit[]
Export["2019-nCoV-regression.svg", %];
plotFit[LogPlot, ListLogPlot]
Export["2019-nCoV-regression-log.svg", %];
