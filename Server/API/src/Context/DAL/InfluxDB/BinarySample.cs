using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.DAL.InfluxDB
{
    internal class BinarySample: Sample
    {
        public override bool AsBoolean()
        {
            return Utilities.Converter.ConvertToBoolean(this.Value);
        }

        public override float AsFloat()
        {
            return Utilities.Converter.ConvertToFloat(this.Value);
        }
    }
}
