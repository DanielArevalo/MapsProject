using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MapsProject.Models
{
	public class HeadersArchivo
	{
		public string placeholder { get; set; }
		public string provider { get; set; }
		public string address { get; set; }
		public string phone { get; set; }
		public string latitude { get; set; }
		public string longitude { get; set; }
		public string email { get; set; }
		public string id { get; set; }

		public static implicit operator List<object>(HeadersArchivo v)
		{
			throw new NotImplementedException();
		}
	}
}