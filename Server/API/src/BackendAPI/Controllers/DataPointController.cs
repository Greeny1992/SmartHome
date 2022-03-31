using Context;
using Context.DAL;
using Context.DAL.Data;
using Context.DAL.Data.DataPoints;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataPointController : Controller
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpGet("GetDataPoint")]
        public async Task<ActionResult<DataPoint>> GetDataPoint()
        {
            return await mongo.DataPoints.FindOneAsync(_ => true);
        }

        [HttpGet("GetDataPoints")]
        public async Task<IEnumerable<DataPoint>> GetDataPoints()
        {
            return mongo.DataPoints.FilterBy(_ => true);
        }

        [HttpPost("AddModbusDataPoint")]
        public async Task<ActionResult<DataPoint>> AddModbusDataPoint([FromBody] ModbusDataPoint mbDataPoint)
        {
            return await mongo.DataPoints.InsertOrUpdateOneAsync(mbDataPoint);
        }

        [HttpPost("AddMQTTDataPoint")]
        public async Task<ActionResult<DataPoint>> AddMQTTDataPoint([FromBody] MQTTDataPoint mbDataPoint)
        {
            return await mongo.DataPoints.InsertOrUpdateOneAsync(mbDataPoint);
        }
        [HttpPatch("UpdateModbusDataPoint")]
        public async Task<ActionResult<DataPoint>> UpdateModbusDataPoint([FromBody] ModbusDataPoint mbDataPoint)
        {
            return await mongo.DataPoints.InsertOrUpdateOneAsync(mbDataPoint);
        }

        [HttpPatch("UpdateMQTTDataPoint")]
        public async Task<ActionResult<DataPoint>> UpdateMQTTDataPoint([FromBody] MQTTDataPoint mbDataPoint)
        {
            return await mongo.DataPoints.InsertOrUpdateOneAsync(mbDataPoint);
        }
    }
}
