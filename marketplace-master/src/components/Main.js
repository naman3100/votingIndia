import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (

      <div id="content">
        <h1>LIST OF POLITICAL PARTIES</h1>
        <table>
          <thead>
            <tr>
              <th># ID</th>
              <th>Party Name</th>
              <th>Symbol</th>
              <th>
              { this.props.chairperson==this.props.account
                      ? <td>Votes</td> : null
                    }
                </th>
            </tr>
          </thead>
          <tbody id="candidateList">
            { this.props.candidates.map((candidate, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{candidate.id.toString()}</th>
                  <td><b>{candidate.name}</b></td>
                  <td><img src={candidate.img} height="75px" width="93px"/></td>
                    { this.props.chairperson==this.props.account
                      ? <td> {candidate.voteCount.toString()}</td> : null
                    }
                  <td>
                    { !this.props.voter
                      ? <button className="btn btn-primary"
                          id={candidate.id}
                          name={candidate.name}
                          onClick={(event) => {
                            this.props.castVote(event.target.id)
                          }}
                        >
                          Vote
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>  

         
        
      </div>


    )
      
  }
}

export default Main;
