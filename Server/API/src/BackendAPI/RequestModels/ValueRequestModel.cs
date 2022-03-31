using Context.DAL.Data;
using InfluxDB.Client.Core.Flux.Domain;

namespace BackendAPI.RequestModels
{
    public class ValueRequestModel
    {
        public DataPoint dataPoint { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
    }
}
