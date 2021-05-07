<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class=" explorer-page page">
    <div class="container explorer-body centerDiv">
      <form style="align-items:center;">
        <div class="justify-between">
          <div>
            <p>Contract Address </p>
            <input v-model="contractAddress" class="verify" placeholder="ONE Contract Address" type="text">
          </div>
          <div>
            <p>Compiler </p>
            <input v-model="compiler" class="verify" placeholder="Solidity Compiler Version" type="text">
          </div>
          <div>
            <p>Optimizer </p>
            <select v-model="optimzerBool">
              <option value="No">
                No
              </option>
              <option value="Yes">
                Yes
              </option>
            </select>
            <input v-model="optimzerNumber" class="verify" placeholder="Number Of Times" type="text">
          </div>
        </div>
        <br>
        <div class="justify-between">
          <div>
            <p>Contract Name</p>
            <input v-model="contractName" class="verify" placeholder="ONE Name" type="text">
          </div>
          <div>
            <p>Chain Type</p>
            <select v-model="chainType">
              <option value="mainnet">
                Mainnet
              </option>
              <option value="testnet">
                Testnet
              </option>
            </select>
          </div>
        </div>
        <br>
        <div>
          <p>Enter the Solidity Contract Code below</p>
          <textarea v-model="code" class="verify" rows="35" cols="100"></textarea>
        </div>

        <!-- <div class="btn">
          <p>Contructor Arguments</p>
          <textarea v-model="contructorValue" rows="1" cols="50"></textarea>
        </div> -->
        <br />
        <div class="" style="border-style: solid;border-width:thin" @click="libraryClick($event)">
          Contract Library Address ( for contracts that use libraries, supports up to 5 libraries)
        </div>
        <br />
        <div v-if="clicked">
          <div style="display:flex" class="justify-around"> 
            <div> 
              <p>Library_1 Name: </p>
              <input v-model="lib1" placeholder="ONE Contract Address" type="text">
            </div> <div>
              <p>Library_2 Name: </p>
              <input v-model="lib2" placeholder="ONE Contract Address" type="text">
            </div> <div>
              <p>Library_3 Name: </p>
              <input v-model="lib3" placeholder="ONE Contract Address" type="text">
            </div>
          </div>
          <div style="display:flex" class="justify-around">
            <div>
              <p>Library_4 Name: </p>
              <input v-model="lib4" placeholder="ONE Contract Address" type="text">
            </div> <div>
              <p>Library_5 Name: </p>
              <input v-model="lib5" placeholder="ONE Contract Address" type="text">
            </div>
          </div>
        </div>
        <br />

        <button class="btn btn-primary centerDiv" type="submit" @click="submit">
          Submit
        </button>
      </form>
    </div>
    <div class="container centerDiv" style="position:relative;left:10%;"> 
      <p v-if="status" style="color:red">
        Something went wrong. Check your inputs and try again.
      </p>
      <br />
      <p v-if="displayMessage" style="color:blue">
        Completed !
      </p>
      <div v-if="loading">
        <LoadingMessage />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import LoadingMessage from './LoadingMessage'

export default {
  name: 'VerifyContract',
  components: LoadingMessage,
  data() {
    return {
      contractAddress: '',
      compiler: '',
      optimzerBool: 'No',
      optimzerNumber: '0',
      code: '',
      lib1: '',
      lib2: '',
      lib3: '',
      lib4: '',
      lib5: '',
      clicked: false,
      contructorValue: '',
      contractName: '',
      chainType: 'testnet',
      status: false,
      displayMessage: false,
      loading: false,
    }
  },
  methods: {
    libraryClick: function (event) {
      this.clicked = !this.clicked
    },
    submit: async function () {
      this.loading = true
      if (
        this.contractAddress == '' ||
        this.compiler == '' ||
        this.sourceCode == '' ||
        this.contractName == ''
      ) {
        this.status = true
      } else {
        const res = await axios.post(
          `${process.env.VUE_APP_EXPLORER_BACKEND_URL}/codeVerification`,
          {
            contractAddress: this.contractAddress,
            compiler: this.compiler,
            optimizer: this.optimzerBool,
            optimizerTimes: this.optimzerNumber,
            sourceCode: this.code,
            libraries: [this.lib1, this.lib2, this.lib3, this.lib4, this.lib5],
            constructorArguments: this.contructorValue,
            chainType: this.chainType,
            contractName: this.contractName,
          }
        )
        this.loading = false
        if (res.data === false) {
          this.sourceCode = true
        } else {
          this.displayMessage = false
        }
      }
    },
  },
}
</script>
