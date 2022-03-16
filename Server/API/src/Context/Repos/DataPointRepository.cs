using Context.DAL.Data;
using Context.Settings;
using MongoDB.Driver;

namespace Context.Repos
{
    public class DataPointRepository : MongoRepository<DataPoint>, IDataPointRepository
    {

        public DataPointRepository(MongoDBContext Context) : base(Context)
        {
        }

        public Task AddVisualToDataPoint(DataPointVisual visual, DataPoint point)
        {
            point.Internal_Visual = visual;
            return this.InsertOrUpdateOneAsync(point);

        }

        public Task<DataPoint> FindByDataBaseName(string name)
        {
            return this.FindOneAsync(val => val.DatabaseName == name);
        }
    }
}
