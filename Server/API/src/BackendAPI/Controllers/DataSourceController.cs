using Context;
using Context.DAL.Data;
using Context.DAL.Data.Sources;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataSourceController : Controller
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpGet("GetDataSources")]
        public async Task<IEnumerable<DataSource>> GetDataSources()
        {
            return mongo.DataSources.FilterBy(_ => true);
        }

        [HttpGet("GetDataSource")]
        public async Task<ActionResult<DataSource>> GetDataSource()
        {
            return await mongo.DataSources.FindOneAsync(_ => true);
        }

        [HttpPost("AddDataSource")]
        public async Task<ActionResult<DataSource>> AddDataSource([FromBody] DataSource dataSource)
        {
            return await mongo.DataSources.InsertOrUpdateOneAsync(dataSource);
        }

        [HttpPatch("UpdateModbusDataSource")]
        public async Task<ActionResult<DataSource>> UpdateModbusDataSource([FromBody] ModbusDatasource mbDataSource)
        {
            return await mongo.DataSources.InsertOrUpdateOneAsync(mbDataSource);
        }

        [HttpPatch("UpdateMQTTDataSource")]
        public async Task<ActionResult<DataSource>> UpdateMQTTDataSource([FromBody] MQTTDatasource mqttDataSource)
        {
            return await mongo.DataSources.InsertOrUpdateOneAsync(mqttDataSource);
        }
    }
}
