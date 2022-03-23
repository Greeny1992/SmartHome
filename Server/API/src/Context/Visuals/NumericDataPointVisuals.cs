namespace Context.DAL.Data
{
    public class NumericDataPointVisuals : DataPointVisual
    {
        public NumericDataPointVisuals()
        {

        }

        public int MinValue { get; set; }

        public int MaxValue { get; set; }

        public String Unit { get; set; }
    }
}
