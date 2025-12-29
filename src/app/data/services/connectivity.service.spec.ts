import {TestBed} from '@angular/core/testing';
import {ConnectivityService} from './connectivity.service';

// Mock Capacitor Network
const mockNetwork = {
  getStatus: jasmine.createSpy('getStatus'),
  addListener: jasmine.createSpy('addListener')
};

(global as any).Network = mockNetwork;

describe('ConnectivityService', () => {
  let service: ConnectivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectivityService]
    });

    // Reset mocks
    mockNetwork.getStatus.calls.reset();
    mockNetwork.addListener.calls.reset();
  });

  it('should be created', () => {
    mockNetwork.getStatus.and.returnValue(Promise.resolve({connected: true}));
    service = TestBed.inject(ConnectivityService);
    expect(service).toBeTruthy();
  });

  it('should initialize with network status', async () => {
    mockNetwork.getStatus.and.returnValue(Promise.resolve({connected: true}));

    service = TestBed.inject(ConnectivityService);

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockNetwork.getStatus).toHaveBeenCalled();
    expect(service.connected()).toBe(true);
  });

  it('should detect offline status', async () => {
    mockNetwork.getStatus.and.returnValue(Promise.resolve({connected: false}));

    service = TestBed.inject(ConnectivityService);

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(service.connected()).toBe(false);
  });

  it('should check connection status', async () => {
    mockNetwork.getStatus.and.returnValue(Promise.resolve({connected: true}));

    service = TestBed.inject(ConnectivityService);

    const isConnected = await service.checkConnection();

    expect(isConnected).toBe(true);
    expect(mockNetwork.getStatus).toHaveBeenCalled();
  });

  it('should listen for network changes', () => {
    mockNetwork.getStatus.and.returnValue(Promise.resolve({connected: true}));

    service = TestBed.inject(ConnectivityService);

    expect(mockNetwork.addListener).toHaveBeenCalledWith(
      'networkStatusChange',
      jasmine.any(Function)
    );
  });
});
