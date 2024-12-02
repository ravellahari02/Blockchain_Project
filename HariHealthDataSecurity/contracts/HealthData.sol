// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthData {
    struct Record {
        uint256 id;
        string patientName;
        string healthInfo;
    }

    mapping(uint256 => Record) public records;
    uint256 public recordsCount;

    // Events emitted for new records and debugging
    event RecordAdded(uint256 indexed id, string patientName, string healthInfo);
    event DebugCount(uint256 count);
    event DebugRecordAdded(uint256 id, string name, string info);

    constructor() {
        recordsCount = 0; // Start count at 0 if no initial record is needed
    }

    function addRecord(string memory _patientName, string memory _healthInfo) public returns (uint256) {
        recordsCount++;
        records[recordsCount] = Record(recordsCount, _patientName, _healthInfo);
        
        emit RecordAdded(recordsCount, _patientName, _healthInfo);
        emit DebugCount(recordsCount); // Debugging event
        emit DebugRecordAdded(recordsCount, _patientName, _healthInfo); // Debugging event

        return recordsCount;
    }

    function getRecord(uint256 _recordId) public view returns (Record memory) {
        require(_recordId > 0 && _recordId <= recordsCount, "Record does not exist");
        return records[_recordId];
    }
}
