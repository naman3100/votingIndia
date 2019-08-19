pragma solidity >=0.4.22 <0.6.0;

contract Marketplace {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        string img;
    }

    // Store accounts that have voted
    address public chairperson;
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;
    uint public votersCount;
    bool public disp;
    string public winner;
    bool public declared;
    string public img;

    event votedEvent (
        uint indexed _candidateId
    );

    event declaredEvent(
        string winner
    );

   

       constructor () public {
           declared = false;
        chairperson=msg.sender;
        addCandidate("All India Trinamool Congress","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP8WCPPLpJEjP8hPG2Pm9tY-q3BocfJYlHS_4EjgOxy7T4mdbVVQ");
        addCandidate("Bhaujan Samaj Party","https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Elephant_Bahujan_Samaj_Party.svg/2000px-Elephant_Bahujan_Samaj_Party.svg.png");
        addCandidate("Bharatiya Janta Party","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpJl6cJEVPCy1xYQr12kcHIuESXtHN6pHtmQGo9ImreD8j_RO-");
        addCandidate("Communist Party Of India","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5ynSrv-hRn-dWbznroPosAJhSySXArqYGdmcJiYl-BOTpP4VV");
        addCandidate("India National Congress","https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_the_Indian_National_Congress.svg/1200px-Flag_of_the_Indian_National_Congress.svg.png");
        addCandidate("Nationalist Congress Party","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo_-om9vjCwCUDifC13mwxgfz9eZDrMS_6Fpx57ZmizfTvtCW9");
        addCandidate("National People's Party","https://bsmedia.business-standard.com/_media/bs/img/article/2018-10/30/full/1540898489-4059.jpg");
    }

    function addCandidate (string memory _name, string memory _img) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, _img);
    }


  

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
        votersCount++;
        // trigger voted event
        emit votedEvent(_candidateId);
    }

   function declare(string memory _party, string memory _img) public {
       require(msg.sender == chairperson);

        winner = _party;
        img = _img;
        declared =true;
        emit declaredEvent(winner);

   }

}

