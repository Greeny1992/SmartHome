using Context.DAL.Data;

namespace Context.Repos
{
    public interface IDataPointRepository : IMongoRepository<DataPoint>
    {

        Task AddVisualToDataPoint(DataPointVisual visual, DataPoint point);
        Task<DataPoint> FindByDataBaseName(String name);
    }
}
