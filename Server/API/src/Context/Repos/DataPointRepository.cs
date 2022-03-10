using Context.DAL.Data;
using Context.Settings;

namespace Context.Repos
{
    public class DataPointRepository : MongoRepository<DataPoint>, IDataPointRepository
    {
        public DataPointRepository(MongoDBContext Context) : base(Context)
        {
        }

        public Task AddVisualToDataPoint(DataPointVisual visual, DataPoint point)
        {
            throw new NotImplementedException();
        }

        public Task<DataPoint> FindByDataBaseName(string name)
        {
            throw new NotImplementedException();
        }
    }
}
