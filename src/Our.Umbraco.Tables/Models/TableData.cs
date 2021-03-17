using System.Collections.Generic;
using Newtonsoft.Json;

namespace Our.Umbraco.Tables.Models
{
	public class TableData
	{
		[JsonProperty("settings")]
		public StyleData Settings { get; set; } = new StyleData();

		[JsonProperty("rows")]
		public List<RowSettings> RowSettings{get; set; } = new List<RowSettings>();

		[JsonProperty("columns")]
		public IEnumerable<StyleData> Columns { get; set; } = new List<StyleData>();

		[JsonProperty("cells")]
		public IEnumerable<IEnumerable<CellData>> Cells { get; set; } = new List<List<CellData>>();

	}
}