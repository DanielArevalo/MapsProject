using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using MapsProject.Logic;
using MapsProject.Models;

namespace MapsProject.Controllers
{
	public class MapsController : Controller
	{
		// GET: Maps
		public ActionResult Index(string idCompany)
		{
			var dataCompany = "";
			var sd = Logic.Logic.DataCompany(idCompany);
			foreach (var item in sd)
			{
				if (item.Last().ToString() == idCompany) continue;
				dataCompany = Logic.Logic.LogoCompany(item);

				ViewBag.DataCompany = dataCompany;
				ViewBag.ds = idCompany;
				ViewBag.sd = sd[1].Replace("Name:", "");
			}

			return View();
		}

		[HttpGet]
		public JsonResult GetAllSites()
		{
			try
			{
				var fileJson = Logic.Logic.DataFile();
				return Json(fileJson, JsonRequestBehavior.AllowGet);
			}
			catch (Exception)
			{
				return Json(new List<string>(), JsonRequestBehavior.AllowGet);
			}
		}

		private string GetCityName(string lat, string lng)
		{
			try
			{
				var xDoc = new XmlDocument();
				xDoc.Load("https://maps.googleapis.com/maps/api/geocode/xml?latlng=" + lat + "," + lng +
				          "&location_type=ROOFTOP&result_type=street_address&key=" +
				          ConfigurationManager.AppSettings["GoogleApiKey"]);
				var xNodelst = xDoc.GetElementsByTagName("result");
				var xNode = xNodelst.Item(0);
				if (xNode == null) return "BOGOTÁ";
				var il = xNode.SelectSingleNode("address_component[5]/long_name").InnerText;
				return il;
			}
			catch (Exception e)
			{
				return "BOGOTÁ";
			}
		}

		[HttpGet]
		public JsonResult GetSitePerFilter(string param, string filter, string lat, string lng)
		{
			try
			{
				HeadersArchivo s = null;
				if (string.IsNullOrEmpty(param))
					param = GetCityName(lat, lng);
				var rtn = Logic.Logic.DataFile();
				foreach (var item in rtn)
				{
					if (item.id.Equals(filter) || item.provider.Equals(param))
					{
						s = item;
					}
				}

				if (rtn.Count > 0)
					return Json(s, JsonRequestBehavior.AllowGet);
				param = GetCityName(lat, lng);
				//rtn = _cnt.GetSpecificMapPlaces(param, cnt);
				return Json(param, JsonRequestBehavior.AllowGet);
			}
			catch (Exception)
			{
				return Json("2", JsonRequestBehavior.AllowGet);
			}
		}

	}
}