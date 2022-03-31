using BackendAPI.RequestModels;
using Context;
using Context.DAL.Data;
using Context.DAL.InfluxDB;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValueController : Controller
    {
        InfluxDBUnitOfWork uow = MonitoringFacade.Instance.InfluxDB;

        [HttpGet("GetLastValue")]
        public async Task<ActionResult<Sample>> GetLastValue([FromBody] DataPoint dp)
        {
            return await uow.Repository.GetLast(dp);
        }

        [HttpGet("GetLastValues")]
        public async Task<List<Sample>> GetLastValues([FromBody] ValueRequestModel rm)
        {
            return await uow.Repository.GetInTimeRange(rm.dataPoint, rm.startDate, rm.endDate);
        }
    }
}
