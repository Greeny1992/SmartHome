using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Context.DAL.Alarm
{
    public class AlarmThreshold
    {
        public object Threashold { get; set; }

        [BsonRepresentation(BsonType.String)]
        public AlarmType AlarmType { get; set; }

        [BsonRepresentation(BsonType.String)]
        public AlarmCheckType AlarmCheckType { get; set; }
        public String Message { get; set; }

    }

    public enum AlarmCheckType
    {
        Equal, // ==
        NotEqual, // != 
        BottomUp, // <
        TopDown  // >
    }

    public enum AlarmType
    {
        Warning,
        Alarm,
        Trip
    }
}
