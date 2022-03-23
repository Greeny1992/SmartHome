using Context.DAL.Data;
using Context.DAL.Data.DataPoints;
using Context.DAL.Data.Sources;
using Modbus.Data;
using Modbus.Device;
using Modbus.Utility;
using MQTTnet.Client.Options;
using MQTTnet.Extensions.ManagedClient;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Context.Driver
{
    public class ModbusDriver : Driver
    {
        ModbusSlave _Slave;
        ModbusIpMaster _Master;
        TcpClient masterTcpClient;
        TcpListener slaveTcpListener;

        ILogger log;

        ModbusDatasource Datasource;
        public ModbusDriver(ModbusDatasource src) : base(src.Name)
        {
            Datasource = src;
        }
        public override async Task Connect()
        {
            
        }

        public override async Task Create()
        {
            IPAddress address = IPAddress.Parse(this.Datasource.Host);

            // create the master
            masterTcpClient = new TcpClient(address.ToString(), this.Datasource.Port);
            _Master = ModbusIpMaster.CreateIp(masterTcpClient);

        }

        public override async Task Disconnect()
        {
            masterTcpClient.Close();
            slaveTcpListener.Stop();
        }

        public override async Task Read()
        {
            List<bool> inputs = new List<bool>();

            foreach (DataPoint dps in this.Datasource.DataPoints)
            {
                if(dps.GetType() == typeof(ModbusDataPoint))
                {
                    ModbusDataPoint mydatapoint = dps as ModbusDataPoint;
                    if (mydatapoint.GetType() == typeof(Boolean))
                    {
                        inputs.AddRange(_Master.ReadInputs((ushort)mydatapoint.Register, 1).ToList<bool>());
                    }
                    else if (mydatapoint.GetType() == typeof(float))
                    {
                        ushort[] temp = _Master.ReadInputRegisters((ushort)mydatapoint.Register, 2);
                        DecodeNumeric(temp, new Measurement(), mydatapoint);
                    }

                }                         
            }
        }

        private Measurement DecodeNumeric(ushort[] register, Measurement sample, ModbusDataPoint pt)
        {
            if (pt.DataType == DataType.Float)
            {

                if (register.Count() > 1)
                {
                    if (register.Count() == 2)
                    {
                        ushort register0 = register[0];
                        ushort register1 = register[1];

                        if (pt.ReadingType == ReadingType.HighToLow)
                        {
                            register0 = register[1];
                            register1 = register[0];
                        }

                        sample.Value = ModbusUtility.GetSingle(register0, register1);


                        log.Verbose($"Reading {this.Name} Quantity 2 - Address {pt.Register}/{pt.RegisterCount} returned {sample.Value}");
                    }
                    else
                    {
                        sample.Value = 0;
                        //sample.Status = MeasurementStatus.NotFound;
                        log.Verbose($"Reading {this.Name} Quantity 2 - Address {pt.Register}/{pt.RegisterCount} Not found");
                    }
                }
                else if (register.Count() == 1)
                {
                    ushort register0 = register[0];
                    sample.Value = Utilities.Converter.ConvertToFloat(register0);
                }
                else
                {
                    sample.Value = 0;
                    //sample.Status = MeasurementStatus.NotFound;
                }
            }

            return sample;

        }
    }
}

