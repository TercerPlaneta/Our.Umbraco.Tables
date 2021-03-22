using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Our.Umbraco.Tables.Enums;
using Our.Umbraco.Tables.Models;
namespace Our.Umbraco.Tables.Models
{
	public class RowSettings 
	{
		[JsonConverter(typeof(StringEnumConverter))]
		[JsonProperty("backgroundColor")]
		public BackgroundColour BackgroundColor { get; set; } = BackgroundColour.None;

		[JsonConverter(typeof(BoolConverter))]
		[JsonProperty("isHead")]
		public bool IsHeader { get; set; }

		[JsonConverter(typeof(BoolConverter))]
		[JsonProperty("isFooter")]
		public bool IsFooter { get; set; }
	}

	public class BoolConverter : JsonConverter
	{
		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			writer.WriteValue(((bool)value) ? 1 : 0);
		}

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			return reader.Value?.ToString() == "1";
		}

		public override bool CanConvert(Type objectType)
		{
			return objectType == typeof(bool);
		}
	}
}
