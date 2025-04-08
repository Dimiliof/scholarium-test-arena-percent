
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Σχετικά με το EduPercentage</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">
              Το EduPercentage είναι μια εκπαιδευτική πλατφόρμα που δημιουργήθηκε με σκοπό 
              να παρέχει δωρεάν πρόσβαση σε εκπαιδευτικό υλικό για όλα τα σχολεία της Ελλάδας.
            </p>
            
            <p className="mt-4">
              Η πλατφόρμα μας προσφέρει:
            </p>
            
            <ul className="mt-2 space-y-2">
              <li>Προσομοιώσεις και διαγωνίσματα για όλα τα σχολικά μαθήματα</li>
              <li>Δυνατότητα για τους εκπαιδευτικούς να προσθέσουν το δικό τους υλικό</li>
              <li>Παρακολούθηση της προόδου των μαθητών</li>
              <li>Στοχευμένη εξάσκηση και άμεση αξιολόγηση</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Η Αποστολή μας</h2>
            
            <p>
              Πιστεύουμε ότι η εκπαίδευση πρέπει να είναι προσβάσιμη σε όλους. Η αποστολή μας είναι 
              να παρέχουμε υψηλής ποιότητας εκπαιδευτικό υλικό και εργαλεία που θα βοηθήσουν τους 
              μαθητές να βελτιώσουν τις επιδόσεις τους και τους εκπαιδευτικούς να εμπλουτίσουν 
              τη διδασκαλία τους.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-green-800">Για Σχολεία</h3>
              <p className="mb-4">
                Είμαστε στην ευχάριστη θέση να προσφέρουμε την πλατφόρμα μας δωρεάν σε όλα τα σχολεία της Ελλάδας.
                Εάν εκπροσωπείτε ένα σχολείο και θέλετε να αποκτήσετε πρόσβαση, μπορείτε να εγγραφείτε μέσω της φόρμας εγγραφής.
              </p>
              <Link to="/school-registration">
                <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 border-0">
                  Εγγραφή Σχολείου
                </Button>
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Επικοινωνήστε μαζί μας</h2>
            
            <p>
              Για οποιαδήποτε απορία ή πληροφορία, μη διστάσετε να επικοινωνήσετε μαζί μας στο email: 
              <a href="mailto:dimitris.liofis@atsoglou.gr" className="text-primary hover:underline ml-1">
                dimitris.liofis@atsoglou.gr
              </a>
            </p>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link to="/">
              <Button>Επιστροφή στην αρχική</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
