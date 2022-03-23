using Context.DAL.Alarm;
using Context.DAL.Data.DataPoints;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;

namespace Context.DAL.Data
{
    [BsonDiscriminator(RootClass = true)]
    [BsonKnownTypes(typeof(MQTTDataPoint), typeof(ModbusDataPoint))]
    public class DataPoint : MongoDocument
    {

        public DataPoint()
        {
        }

        public String DatabaseName { get; set; }
        public String Name { get; set; }

        [BsonRepresentation(BsonType.String)]
        public DataType DataType { get; set; }
        public int Offset { get; set; }
        public String Description { get; set; }
        public Dictionary<String, AlarmThreshold> AlarmThresholds { get; set; } = new();

        public One<DataSource> DataSource { get; set; }

        public One<DataPointVisual> Internal_Visual { get; set; }

        [BsonIgnore]
        public DataPointVisual Visual
        {
            get
            {
                try
                {
                    if (Internal_Visual != null)
                    {
                        Task<DataPointVisual> sk = Internal_Visual.ToEntityAsync();
                        sk.Wait();

                        return sk.Result;
                    }
                }
                catch (Exception e)
                {
                    return null;
                }

                return null;
            }
        }
    }

    public enum DataType
    {
        Boolean,
        Float
    }
}
