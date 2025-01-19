import React, { useState } from 'react'
import SettingSection from './SettingSection'
import { HelpCircle, Plus } from 'lucide-react';


const ConnectedAccounts = () => {
    const [connectedAccounts, setConnectedAccounts] = useState([
        { id: 1, name: 'Google', connected: true, icon: '/google.png'},
        { id: 2, name: 'Facebook', connected: false, icon: '/facebook.png'},
        { id: 3, name: 'Twitter', connected: true, icon: '/x.jpeg'},
    ]);
  return (
      <>
          <SettingSection icon={HelpCircle} title={'Connected Accounts'}>
              {connectedAccounts.map((account) => (
                  <div key={account.id} className='flex items-center justify-between py-3'>
                      <div className='flex gap-1'>
                          <img src={account.icon} alt="Social img" className='size-6 object-cover rounded-full mr-2' />
                          <span className=''>{account.name}</span>
                      </div>
                      
                      <button className={`px-3 py-1 rounded ${
                          account.connected ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                        } transition duration-200`}
                        onClick={() => {
                            setConnectedAccounts(
                                connectedAccounts.map((acc) => {
                                    if (acc.id === account.id) {
                                            return {
                                              ...acc, // Copies all existing properties of `acc`
                                              connected: !acc.connected, // Toggles the `connected` value (true to false, or vice versa)
                                            };
                                        }
                                    return acc;
                                })
                            );
                          }}>
                          {account.connected ? 'connected' : 'connect'}
                    </button>
                  </div>
              ))}
              <button className='mt-4 flex items-center text-indigo-900 hover:text-indigo-300 transition duration-200 dark:text-indigo-400'>
                  <Plus size={18} className='mr-2' />
                  Add Account
              </button>
              
          </SettingSection>
      </>
  )
}

export default ConnectedAccounts