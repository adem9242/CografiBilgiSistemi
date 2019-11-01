using mapApplication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Globalization;

namespace mapApplication.Controllers
{
     
    public class DefaultController : Controller
    {
        HARİTAEntities db = new HARİTAEntities();
        string asd;

        // GET: Default
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult KapilariYukle(string kor)
        {
           
            List<string> kisiListesi = new List<string>();
            
            List<string> num = (from x in db.Kapi select x.KOORDINAT).ToList();

            string[] numa = (from x in db.Kapi select x.KOORDINAT).ToArray();
            foreach (var item in db.Kapi)
            {
                string n = item.KOORDINAT;
                char[] noktaayrac = { ',' };
                string[] noktaninparcalar = n.Split(noktaayrac);
                string Px = noktaninparcalar[0];
                string Py = noktaninparcalar[1];

                string a = @"""deneme""";

                kisiListesi.Add(Px);
                kisiListesi.Add(Py);
                kisiListesi.Add(a);

            }


            // string ntarih = n;
            string[] array = kisiListesi.ToArray();

            return Json(kisiListesi,JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult SavePointMahalle(Mahalle mah, string koordinat, string mahadi)
        {
            int sayac = 0;
            HARİTAEntities1 db = new HARİTAEntities1();

            foreach (var item in db.Mahalle)
            {
                if (item.KOORDINAT == koordinat)
                {
                    sayac = 1;
                }
            }
            if (sayac == 0)
            {
                mah.MAH_ADI = mahadi;
                mah.KOORDINAT = koordinat;

                db.Mahalle.Add(mah);
                db.SaveChanges();
            }
            return Json("");
        }

        
        [HttpPost]
        public JsonResult SavePointKapi(Kapi kapi, string koordinatkapi, int kapino,int mahkodu)
        {
            // kaydet ekleme işlemi
           int sayac = 0;

            foreach (var item in db.Mahalle)
            {
                if (item.KOORDINAT == koordinatkapi)
                {

                    sayac = 1;
                }
            }
            if (sayac == 0)
            {
                kapi.KAPI_NO = kapino;
                kapi.KOORDINAT = koordinatkapi;
                kapi.MAH_KODU = mahkodu;
                db.Kapi.Add(kapi);
                db.SaveChanges();
            }
            return Json("");
        }

        [HttpPost]
        public JsonResult SavePointKapim(Kapi kapi, string koordinatkapi)
        {

            foreach (var item in db.Mahalle)
            {
                string a = item.KOORDINAT;

                char[] ayrac = { '.', ',', '.', ',', '.', ',', '.', ',', '.', ',', '.', ',', '.', ',', '.', ',' };
                // string tarih = a;

                string[] parcalar = a.Split(ayrac);

                double Ax = Convert.ToDouble(parcalar[0]);
                double Ay = Convert.ToDouble(parcalar[2]);
                double Bx = Convert.ToDouble(parcalar[4]);
                double By = Convert.ToDouble(parcalar[6]);
                double Cx = Convert.ToDouble(parcalar[8]);
                double Cy = Convert.ToDouble(parcalar[10]);
                string n = koordinatkapi;
                char[] noktaayrac = { '.', ',', '.', ',' };
                // string ntarih = n;

                string[] noktaninparcalar = n.Split(noktaayrac);
                double Px = Convert.ToDouble(noktaninparcalar[0]);
                double Py = Convert.ToDouble(noktaninparcalar[2]);

                double bx = Bx - Ax;
                double by = By - Ay;
                double cx = Cx - Ax;
                double cy = Cy - Ay;
                double x = Px - Ax;
                double y = Py - Ay;


                double d = (bx * cy) - (cx * by);
                double wa = (x * (by - cy) + (y * (cx - bx)) + (bx * cy) - (cx * by)) / d;
                double wb = (x * cy - y * cx) / d;
                double wc = ((y * bx) - (x * by)) / d;

                if (wa >= 0 && wb >= 0 && wc >= 0)
                {
                    asd = item.MAH_KODU.ToString();
                }
                else
                {
                    asd = "0";
                }
            }
            var mhkodu = asd;
            return Json(mhkodu, JsonRequestBehavior.AllowGet);

        }

    }
}









    
