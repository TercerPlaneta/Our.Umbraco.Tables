using System.Collections.Generic;
using System.Linq;
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
		protected internal IEnumerable<IEnumerable<CellData>> Cells { get; set; } = new List<List<CellData>>();

		// Helper props
		public IEnumerable<IEnumerable<CellData>> HeadRows => Cells.Where(row =>
		row.Any(cell => RowSettings.Any(r => r.IsHeader && RowSettings.IndexOf(r) == cell.RowIndex))
		).ToList();

		public IEnumerable<IEnumerable<CellData>> FooterRows => Cells.Where(row =>
		  row.Any(cell => RowSettings.Any(r => r.IsFooter && RowSettings.IndexOf(r) == cell.RowIndex))
		  ).ToList();

		public IEnumerable<IEnumerable<CellData>> BodyRows => Cells.Where(row =>
		  row.Any(cell => RowSettings.Any(r => !r.IsFooter && !r.IsHeader && RowSettings.IndexOf(r) == cell.RowIndex))
		  ).ToList();
	}
}