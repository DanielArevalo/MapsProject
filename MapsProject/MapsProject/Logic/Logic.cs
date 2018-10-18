using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Security.Policy;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml.Serialization;
using MapsProject.Models;

namespace MapsProject.Logic
{
	public static class Logic
	{
		private static List<string> ReadJson()
		{
			List<string> lstCompanies = new List<string>();
			var fileJson =
				File.ReadAllLines(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"./json/Companies.json"));
			foreach (var item in fileJson)
			{
				var s = string.Join("", Regex.Split(item, @"(?:\r\n|\n|\r|\t|)"));
				lstCompanies.Add(s);
			}

			return lstCompanies;
		}

		public static List<string> LstCompanies()
		{

			List<string> lstCompanies = new List<string>();
			var re = ReadJson();
			foreach (var item in re)
			{
				var r = item.Replace("\"", "");
				var result = r.Replace(",", "").Split(':');

				if (result[0] == "Name")
				{
					lstCompanies.Add(result[1]);
				}
			}

			return lstCompanies;
		}

		public static List<string> DataCompany(string idCompany)
		{
			var s = "";
			var v = "";
			List<string> js = new List<string>();
			var r = ReadJson();
			foreach (var item in r)
			{
				var e = item.Replace("\"", "");
				var result = e.Replace(",", "");
				if (result.Last().ToString() != idCompany && !s.Contains(idCompany)) continue;
				js.Add(result);
				s = result;
			}

			return js;
		}

		public static string LogoCompany(string nameCompany)
		{
			var s = "";
			var r = ReadJson();
			foreach (var item in r)
			{
				var e = item.Replace("\"", "");
				var result = e.Replace(",", "");
				if (result != nameCompany && !s.Contains(nameCompany)) continue;
				s = result;
			}

			return s.Replace("Logo:", "");
		}


		public static List<string> Headers()
		{
			List<string> headers = new List<string>();
			var fileJson =
				File.ReadAllLines(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"./json/pruebas.csv"));

			foreach (var item in fileJson)
			{
				if (item == fileJson[0])
				{
					var s = item.Split(';');
					foreach (var items in s)
					{
						if (items.Equals("")) continue;
						headers.Add(items);
					}
				}
			}

			return headers;
		}

		public static List<HeadersArchivo> DataFile()
		{
			List<HeadersArchivo> fileData = new List<HeadersArchivo>();
			var fileJson =
				File.ReadAllLines(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"./json/pruebas.csv"));

			foreach (var item in fileJson)
			{
				try
				{
					if (item != fileJson[0])
					{
						var s = item.Split(';');
						fileData.Add(new HeadersArchivo
						{
							placeholder = s[0],
							provider = s[1],
							address = s[2],
							phone = s[3],
							latitude = s[4],
							longitude = s[5],
							email = s[6],
							id = s[7]
						});
					}
				}
				catch (Exception e)
				{

				}

			}
			return fileData;
		}

	}
}