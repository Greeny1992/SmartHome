using Context.DAL.Data.Sources;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;

namespace Context.DAL.Data
{
    [BsonDiscriminator(RootClass = true)]
    [BsonKnownTypes(typeof(MQTTDatasource), typeof(ModbusDatasource))]
    public class DataSource : MongoDocument
    {

        public DataSource()
        {
            this.InitOneToMany(() => Internal_DataPoints);
        }

        public String Name { get; set; }

        public Boolean Active { get; set; }

        public Many<DataPoint> Internal_DataPoints { get; set; } = new();

        [BsonIgnore]
        public List<DataPoint>? DataPoints
        {
            get
            {
                try
                {
                    if (Internal_DataPoints != null)
                    {
                        return Internal_DataPoints.ToList();
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
}
