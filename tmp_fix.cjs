const fs = require('fs');

const path = 'd:/Wregals/Code/src/pages/SellerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                </table>
              </div>
            </div>

            </div>


          </div>
        )}`;
        
const fix = `                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}`;

content = content.replace(target, fix);

fs.writeFileSync(path, content);
console.log('Fixed tags');
