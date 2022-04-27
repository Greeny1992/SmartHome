using Context;
using Context.DAL;
using Context.DAL.Alarm;
using Context.DAL.Data;
using Context.DAL.Data.DataPoints;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlarmListController : Controller
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpGet("GetActiveAlarmList")]
        public async Task<ActionResult<List<AlarmListEntry>>> GetActiveAlarmList()
        {
            return await mongo.AlarmList.GetActiveAlarms();
        }

        [HttpGet("GetDeactiveAlarmList")]
        public async Task<ActionResult<List<AlarmListEntry>>> GetDeactiveAlarmList()
        {
            return await mongo.AlarmList.GetDeactiveAlarms();
        }

        [HttpGet("GetUnacknowledgedAlarmList")]
        public async Task<ActionResult<List<AlarmListEntry>>> GetUnacknowledgedAlarmList()
        {
            return await mongo.AlarmList.GetUnacknowledgedAlarms();
        }

        [HttpGet("GetAllAlarms")]
        public async Task<ActionResult<List<AlarmListEntry>>> GetAllAlarms()
        {
            return await mongo.AlarmList.GetAllAlarms();
        }
        [HttpGet("GetAlarm")]
        public async Task<ActionResult<AlarmListEntry>> GetAlarm([FromQuery] String ID)
        {
            return await mongo.AlarmList.FindByIdAsync(ID);
        }

        [HttpPatch("AchnowledgeAlarm")]
        public async Task<ActionResult<List<AlarmListEntry>>> AchnowledgeAlarm([FromBody] string ID, [FromHeader] User usr)
        {
            return await mongo.AlarmList.AcknowledgeAlarm(ID,"comment",usr);
        }
    }
}
